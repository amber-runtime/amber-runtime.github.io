---
id: "background"
order: 1
num: "01"
label: "Background"
screenLabel: "Background"
title: "Background"
---
<h3 class="sh" id="failure-in-production">Failure in Production</h3>

Production failure is a common reality of modern software. To satisfy increased user demand, applications often grow more distributed and asynchronous. This leads to more services, network boundaries, and opportunities for something to fail mid-execution. Restarting a service that crashes isn’t as safe as some might assume.

This is a classic problem in distributed systems.

<img src="img/double-charge.svg" alt="A naive restart re-runs the charge step and charges the customer twice." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

A process may complete part of its work successfully before a later step crashes. When this happens, the process can be stuck in limbo. There’s no preservation of what already happened or where it's safe to resume. Restarting from the beginning can cause real consequences like charging a payment twice.

This is where durable execution comes in.

<h3 class="sh" id="what-is-durable-execution">What is Durable Execution?</h3>

Durable execution is built around workflows and steps that allow code to be replayed deterministically after failures.

A workflow wraps the orchestration logic that defines a process. It represents the execution path and ensures the code can resume from where it left off rather than starting over.

<img src="img/workflow.svg" alt="A workflow is composed of steps" style="display:block;width:100%;height:auto;margin:1.5rem auto;">

Within a workflow are steps, which wrap operations whose results should be preserved across failures. Steps act as checkpoints in execution. When a step completes, the runtime stores its return value so progress can be recovered later. Steps can wrap operations such as API calls, database writes, or work that would be expensive or unsafe to repeat.

<img src="img/steps.svg" alt="Completed steps are check-pointed" style="display:block;width:100%;height:auto;margin:1.5rem auto;">

Unlike normal code execution, durable execution persists workflow progress as it runs. If a failure happens, execution resumes from the last completed step instead of starting over. From the developer’s point of view, the application’s execution flow behaves as if the failure had never happened. In other words, durable execution does not make failures happen less; it makes them less consequential.

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

Traditional workflows usually follow a predictable execution path that developers define ahead of time. Agents operate differently.

An agent is an LLM driven system that reasons about a task, takes actions, and adapts based on results until it reaches a goal.

<img src="img/amber-agent-loop.svg" alt="The agent loop: reason, take action, use tools, observe, repeating." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

This autonomy is what makes agents suited to more open-ended tasks, in which the exact execution steps cannot be determined in advance. A request like "fix this bug" does not map easily to a predetermined sequence. Instead, an agent decides what actions to take, observes the results, and determines the next step as it works toward a solution.

[diagram of regular workflows vs agent workflows]

Although agents behave differently from traditional workflows, they still fit naturally within durable execution. Agent behavior may be nondeterministic, but its progress can still be preserved through durable steps. Once a step completes, the runtime stores its result so it can be recovered after a failure instead of being re-executed. This allows long running agent workflows to resume safely without repeating completed work.

<img src="img/openai_cursor.svg" alt="Openai and cursor logo" style="display:block;width:200px;height:100px;object-fit:contain;margin:0 0 .5rem 0;">

This problem is already becoming relevant in practice. Coding agents like Cursor and ChatGPT Codex are increasingly running long lived workflows, and some are already adopting durable execution runtimes or building systems with similar guarantees [[2]](https://cursor.com/blog/cloud-agent-lessons)[[9]](https://temporal.io/blog/improving-java-sdk-codex-openai).

However, recovery only solves part of the problem: developers still need to understand how an agent reached a particular outcome.

<h3 class="sh" id="challenges-with-observability">Challenges with Observability</h3>

Modern agent observability tools provide developers with visibility into agent behavior. They capture execution traces, model interactions, tool invocations, and token usage. This helps explain why an agent behaved a certain way.

However, these systems are usually separate from the durable execution platforms.

This separation becomes especially problematic during failure and recovery, when visibility matters most. When a durable workflow resumes after a crash, previously completed steps are skipped to preserve progress and avoid repeating work. As a result, when a trace resumes, it will be missing every span before the crash. This leaves the resumed traces incomplete. In other words, agent observability and durable execution frameworks are usually two separate record-keeping systems that are not linked.

[diagram of difference between agent observability system and durable execution system]

Thus one main challenge is integrating both systems so agents can get both durability and observability.

An important aspect to integrating observability is preserving the structural hierarchy of agent traces. For long running, multi-agent workflows, determining which agents spawned a subagent or called a tool is critical to root-cause analysis and cost tracking.

[diagram of what hierarchy looks like]

In summary, durable execution is foundational to reliable long running agents, and we begin the next section, by comparing the existing durable execution platforms.
