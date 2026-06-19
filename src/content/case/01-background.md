---
id: "background"
order: 1
num: "01"
label: "Background"
screenLabel: "Background"
title: "Background"
---
<h3 class="sh" id="failure-in-production">Failure in Production</h3>

In distributed systems, a process may complete part of its work successfully before a later step crashes. When this happens, the process can be stuck in limbo. There’s no preservation of what already happened or where it's safe to resume. Restarting from the beginning can cause real consequences, like charging a payment twice.

<img src="img/double-charge.svg" alt="A naive restart re-runs the charge step and charges the customer twice." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

When systems aren’t distributed, the state at the time of failure can be kept in memory. But when a system is distributed, you need something more than memory to help persist that state.

This is where durable execution comes in.

<h3 class="sh" id="what-is-durable-execution">What is Durable Execution?</h3>

Durable execution is built around workflows and steps that allow code to be replayed deterministically after failures.

A workflow wraps the orchestration logic that defines a process. It represents the execution path and ensures the code can resume from where it left off, rather than starting over.

<img src="img/workflow.svg" alt="A workflow is composed of steps" style="display:block;width:100%;height:auto;margin:1.5rem auto;">

Within a workflow are steps, which wrap operations whose results should be preserved across failures. Steps act as checkpoints in execution. When a step completes, the runtime stores its return value so progress can be recovered later. Steps can wrap operations such as API calls, database writes, or work that would be expensive or unsafe to repeat.

<img src="img/steps.svg" alt="Completed steps are check-pointed" style="display:block;width:100%;height:auto;margin:1.5rem auto;">

Durable execution persists workflow progress as it runs. If a failure happens, execution resumes from the last completed step instead of starting over. From the developer’s point of view, the application’s execution flow behaves as if the failure had never happened. In other words, durable execution does not make failures happen less; it makes them less consequential.

For example, consider code that executes a sequence of five steps where crashes can happen mid-operation at any step.

<div class="de-anim">
  <div class="panel" id="abpanel">
    <div class="ptitle">
      <span>Normal vs durable execution</span>
      <div class="seg-toggle" id="abtoggle">
        <button class="active" data-mode="plain">Normal execution</button>
        <button data-mode="amber">Durable execution</button>
      </div>
    </div>
    <div class="track" id="abtrack">
      <div class="tstep" data-i="1"><span class="n">step 1</span></div>
      <div class="tstep" data-i="2"><span class="n">step 2</span></div>
      <div class="tstep" data-i="3"><span class="n">step 3</span></div>
      <div class="tstep" data-i="4"><span class="n">step 4</span></div>
      <div class="tstep" data-i="5"><span class="n">step 5</span></div>
    </div>
    <div class="de-legend">
      <span class="lg"><i class="sw kept"></i>preserved</span>
      <span class="lg"><i class="sw done"></i>completed</span>
      <span class="lg"><i class="sw lost"></i>discarded</span>
    </div>
    <p class="ab-readout" id="abread">Pick a mode, then simulate a crash mid-operation.</p>
    <button class="btn crash" id="abrun">&#8635; simulate crash</button>
  </div>
</div>

<h3 class="sh" id="why-this-matters-for-agents">Why this Matters for Agents?</h3>

Workflows follow a predictable execution path that developers define ahead of time. Agents operate differently.

An agent is an LLM driven system that reasons about a task, takes actions, and adapts based on results until it reaches a goal.

<img src="img/agent-loop.svg" alt="The agent loop: reason, take action, use tools, observe, repeating." style="display:block;width:65%;height:auto;margin:1.5rem auto;">

This autonomy is what makes agents suited to more open-ended tasks, in which the exact execution steps cannot be determined in advance. A request like "fix this bug" does not map easily to a predetermined sequence. Instead, an agent decides what actions to take, observes the results, and determines the next step as it works toward a solution.

<img src="img/workflow-agent.svg" alt="Comparing workflow with workflows with agent" style="display:block;width:75%;height:auto;margin:1.5rem auto;">

Agent behavior may be nondeterministic, but its progress can still be preserved through durable steps. Once an LLM call completes, the durable execution engine stores the step’s result so it can be recovered after a failure instead of being re-executed. This allows long-running agents to resume safely without repeating completed work.

<img src="img/openai_cursor.svg" alt="Openai and cursor logo" style="display:block;width:200px;height:100px;object-fit:contain;margin:0 0 .5rem 0;">

This problem is already becoming relevant in practice. Coding agents like Cursor and ChatGPT Codex are already adopting durable execution runtimes or building systems with similar guarantees [[2]](https://cursor.com/blog/cloud-agent-lessons)[[9]](https://temporal.io/blog/improving-java-sdk-codex-openai).

<h3 class="sh" id="challenges-with-observability">Challenges with Observability</h3>

Agent observability tools provide developers with visibility into agent behavior. They record execution as traces, which are composed of spans representing individual operations such as LLM calls, tool invocations, or database writes.

<img src="img/Traces.png" alt="Screenshot of traces in an observability platform" style="display:block;width:60%;height:auto;margin:1.5rem auto;">

Durable execution platforms record those same operations differently. A workflow step preserves an operation's result to recover from failures, while a span captures the details of what happened.

<img src="img/observability_durable.svg" alt="2 tables side by side listing observability vs durable execution record keeping" style="width:100%">

Traces matter most after a production failure, which is exactly when durable execution and observability fall out of sync. During recovery, completed steps are restored instead of re-executed. Because spans are only emitted when code runs, restored steps produce no spans. As a result, the resumed run produces an incomplete trace, lacking the spans emitted before the failure.

<img src="img/observability_problem.svg" alt="diagram showing resumed workflow's trace is missing the spans of the completed steps" style="width:100%">

Developers investigating a failure may only see the newly executed portion of a resumed run, not the completed ones that led up to the failure.

Integrating observability with durable execution preserves an agent's progress and its visibility across failures.