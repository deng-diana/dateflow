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
    "Use tools to create, list and complete tasks. Keep replies short. "
    "If the user does not give a date, ask for it before creating the task. "
)

EXTRACT_PROMPT=(
    "Below is one exchange between a user and a task assistant, plus what is "
    "already remembered about the user. If the exchange reveals a NEW lasting "
    "fact or preference not already covered, reply with it in one short sentence. "
    "If nothing new is worth remembering, reply with exactly: NONE"
)


def extract_memory(user_text:str, assistant_text:str, existing:list[str])->str|None:
    """Ask the model whether this exchange contains something worth remembering."""
    known="\n".join(f"- {m}"for m in existing or "- (nothing yet)")
    response=client.messages.create(
        model=MODEL,
        max_tokens=100,
        system=EXTRACT_PROMPT,
        messages=[{"role":"user", "content":f"Already remembered:\n{known}\n\nUser:{user_text}\nAssistant:{assistant_text}"}]
    )
    text= "".join(b.text for b in response.content if b.type=="text").strip()
    return None if text=="NONE" or not text else text

def run_agent(messages: list[dict], memories:list[str])->tuple[str, list[dict]]:
    memory_block="\n".join(f"- {m}" for m in memories) or "- (none yet)"
    system=SYSTEM.format(today=datetime.now(timezone.utc).date().isoformat())+f"\n\nWhat you remember about the user\n{memory_block}"
    tool_calls: list[dict]=[]
    while True:
        response=client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=system,
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

