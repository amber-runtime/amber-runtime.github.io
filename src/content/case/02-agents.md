---
id: "agents"
order: 2
num: "02"
label: "Agents"
screenLabel: "Agents"
title: "Agents"
---
<h3 class="sh">What is an agent?</h3>

An agent is a software application that enables an LLM to direct the application’s execution flow. Agentic connotes reasoning and acting on one's own.

Like traditional software, an agent is still just a predefined set of instructions; the “decision-making” of what the program should do is all written explicitly by the developer upfront. Agentic software differs in that some logic for deciding what to do next is left explicitly unwritten and is instead handed to an LLM, a large language model. The model is given the information it reasons over and a list of actionable instructions, what the industry calls tools, to pick from, and its choice is what drives the app’s behavior. As a result, an agent acts more autonomously. What it does is partially determined at runtime by the LLM, not only by the developer at write time.

<img src="img/amber-agent-loop.svg" alt="The agent loop: reason, take action, use tools, observe, repeating." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

This autonomy is what makes agents suited to open-ended tasks, where the steps to execute, their order, and even how many there will be cannot be reasonably determined in advance. A request like "fix this bug" does not map cleanly to a single known path. Coding is a natural example where agentic software shines where traditional software falls short: rather than following a predetermined sequence, the agent is given a goal in natural language and reasons toward it, taking actions and reacting to their results until it arrives at a solution.

However, that same open-endedness raises an uncomfortable feeling for the developer because a run can take an unknown number of steps, act unpredictably and stretch for long periods of time. We wanted to find out whether AI agents need a durable execution runtime.

<h3 class="sh">Do agents even need durable execution?</h3>

<div class="aslot">
<p class="atag">Placeholder · image</p>
<p class="awhat">[Image of the companies]</p>
</div>

Not all agents require a durable execution runtime.

When you think of agents, you might think of coding agents. Coding agents like Claude and ChatGPT Codex are among the most widely used agents today. Many developers run them locally, supervise their operations, and, when a coding agent crashes, simply re-prompt. The context is preserved in the agent’s conversation history.

The industry is also making agents more reliable by default. Frameworks now provide built-in features like retrying failed tool calls, catching exceptions, and checkpointing state - in addition to conversation history. For many agents, this is enough.

But there's a ceiling to what a framework can make fault-tolerant on its own. An agent's end-to-end workflow can extend beyond the process it lives in, touching external APIs, databases, and even other agents. When it does, the agent faces the same problem distributed systems have always faced: frameworks don't automatically guarantee recovery across those boundaries. That's where durable execution comes in.

Since there are real downsides to integrating a durable execution runtime as discussed, it’s important to recognize at what point is the tradeoff worth it.

Agents benefit most from durable execution when they share these characteristics:

<ul class="bl">
<li>Agents whose tool calls produce consequential external side effects</li>
<li>Long-running, unattended agents</li>
<li>Agents operating across distributed infrastructure
<ul><li>Including multi-agent workflows where coordination spans across multiple servers.</li></ul>
</li>
<li>Agents with costly model calls, for example: video generation, large data processing</li>
<li>Agents running at scale where failures are inevitable and retries are cumulatively expensive.</li>
</ul>

Here’s evidence - a real company, coding agent company at that switched over.

<h3 class="sh">Real world case study: Cursor adopting Temporal</h3>

Earlier we established that coding agents don’t need a durable execution runtime, so why did Cursor’s coding agent adopt Temporal, the most established durable execution solution?

Based on their case study, that is still true, the pivotal point is when moving from their local agents to cloud agents.

The real driver is the combination of long-running tasks and distributed infrastructure failures, VMs crashing, pods being replaced, inference outages, not the agent's unpredictable path itself. A local agent with an unpredictable path doesn't need durable execution because conversation history preserves context across re-prompts, but a cloud agent does because it's exposed to infrastructure failures that can interrupt execution mid-task

durable execution matters because you're moving from local to distributed execution, not because agents are unpredictable

Distribution increases failure probability, long-running work increases the cost of losing progress, and agent unpredictability amplifies both by making them unbounded

<div class="aslot">
<p class="atag">Placeholder · image</p>
<p class="awhat">[image of Cursor adopting Temporal]</p>
</div>

Even though coding agent executes in short-live steps and is highly supervised

<a href="https://cursor.com/blog/cloud-agent-lessons">https://cursor.com/blog/cloud-agent-lessons</a>

^ basically takeaway, external validation of our earlier premise why we need durable execution -&gt; for long running, distributed process

They moved local agents to cloud. Cloud agent = distributed system. When you move the agents to cloud, they inherit the same probs. They got from 90% reliability, switched to Temporal, got 99% reliability

Agents like Claude CLI, they run on your local machine, they fail but no big deal - failure is isolated to one machine. Local Claude usualy copiloted/supervised by dev with human in loop and not long running - let it go ham steps. No big deal when failure. Durable execution doesn’t seem worth it

Conclusion: when agents move to cloud, become long running they inherit the same probs, thats when a durable execution runtime may be justified for agents
