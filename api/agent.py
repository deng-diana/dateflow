# The agent loop: send the conversation to the model, run any tools it asks
# for, feed the results back, repeat until it answers in plain text.

import os
from datetime import datetime, timezone

from anthropic import Anthropic
from dotenv import load_dotenv

from tools import TOOLS, run_tool

load_dotenv()
client= Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
MODEL="claude-sonnet-5"

SYSTEM=(
    "You are DateFlow, a task assistant. Today is {today}. "
    "Use tools to create, list and complete tasks. Keep replies short"
    "If the user does not give a date, ask for it before creating the task. "
)

def run_agent(messages: list[dict])->tuple[str, list[dict]]:
    """ Run one turn. Returns (final_text, tool_calls_made)."""
    tool_calls: list[dict]=[]
    while True:
        response=client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=SYSTEM.format(today=datetime.now(timezone.utc).date().isoformat()),
            tools=TOOLS,
            messages=messages,
        )
        messages.append({"role":"assistant", "content":response.content})

        if response.stop_reason != "tool_use":
            text ="".join(b.text for b in response.content if b.type=="text")
            return text, tool_calls
        
        results=[]
        for block in response.content:
            if block.type=="tool_use":
                output=run_tool(block.name, block.input)
                tool_calls.append({"name":block.name, "input":block.input,"output":output})
                results.append({
                    "type":"tool_result",
                    "tool_use_id":block.id,
                    "content":str(output)
                })
        messages.append({"role":"user", "content":results})

