---
id: "background"
order: 1
num: "01"
label: "Background"
screenLabel: "Background"
title: "Background"
---
<h3 class="sh" id="failure-in-production">Failure in Production</h3>

As AI agents move from local environments into production systems, they need reliability and observability. Once an agent runs in the cloud, its work spans APIs, databases, and multiple services. This makes failures inevitable. Restarting from scratch can mean repeating expensive agent runs and risking duplicated side effects.

Normal execution loses more than the active process when it crashes. It also loses in-memory state, awareness of which steps already ran, and which step should run next. Without a durable record of progress, the safest default is often to start over from the beginning.

<h3 class="sh" id="what-is-durable-execution">What is Durable Execution?</h3>

Unlike normal code execution, durable execution persists its progress as it runs and, after a crash, resumes from that saved progress rather than starting over. Conceptually, from the developer's point of view, the application's execution flow behaves as if the failure had never happened. To clarify though, durable execution does not imply that failures do not happen, or that they happen less.

For example, consider code that executes a sequence of five steps where crashes can happen mid-operation at any step.

<img src="img/amber-double-charge.svg" alt="A naive restart re-runs the charge step and charges the customer twice." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

<h3 class="sh" id="why-this-matters-for-agents">Why this Matters for Agents?</h3>

An agent is a software application that enables an LLM to direct the application's execution flow. Traditional software follows logic that the developer writes upfront. Agentic software leaves some decisions to the model at runtime by giving it context and a set of tools to choose from.

<img src="img/amber-agent-loop.svg" alt="The agent loop: reason, take action, use tools, observe, repeating." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

This autonomy is what makes agents suited to open-ended tasks, where the steps to execute, their order, and even how many there will be cannot be reasonably determined in advance. A request like "fix this bug" does not map cleanly to a single known path. Rather than following a predetermined sequence, the agent reasons toward a goal, takes actions, and reacts to their results until it arrives at a solution.

Not all agents require a durable execution runtime. Many coding agents run locally, are supervised by a developer, and can be re-prompted when they fail because conversation history preserves enough context. The need becomes sharper when agents move to cloud infrastructure, run unattended, produce consequential side effects, or spend significant time and money on model calls.

Agents benefit most from durable execution when they share these characteristics:

<ul class="bl">
<li>Agents whose tool calls produce consequential external side effects</li>
<li>Long-running, unattended agents</li>
<li>Agents operating across distributed infrastructure, including multi-agent workflows across multiple servers</li>
<li>Agents with costly model calls, for example video generation or large data processing</li>
<li>Agents running at scale where failures are inevitable and retries are cumulatively expensive</li>
</ul>

<h3 class="sh" id="challenges-with-observability">Challenges with Observability</h3>

When failures happen, developers need visibility into why an agent took certain actions and where the workflow stood when it failed. Existing tracing tools can show spans, tool calls, model input and output, token usage, and cost. Durable execution engines can show workflow state and recovery progress.

The challenge is that those views are usually split. A tracer may understand the agent but not the durable workflow. A durable execution engine may know which step recovered but not what the agent did inside that step. Amber is built around combining those two views: recovering the workflow while showing the agent behavior inside it.
