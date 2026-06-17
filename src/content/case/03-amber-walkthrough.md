---
id: "amber-walkthrough"
order: 3
num: "03"
label: "Amber Walkthrough"
screenLabel: "Amber Walkthrough"
title: "Amber Walkthrough"
---
Amber fills the gap left by existing durable execution and observability platforms. Current durable execution platforms focus on workflow reliability, while observability tools focus on traces and logs. Amber combines both in a self hosted solution designed specifically for AI agents.

<img src="img/amber-capability-table.svg" alt="Only Amber covers agent-aware tracing, workflow-state visibility, token cost, and durable execution." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

<h3 class="sh" id="amber-overview">Amber Overview</h3>

Amber ships with a Python SDK and a command-line tool for deploying and managing their agents as durable workflows.

Developers can use the CLI to run their durable agents locally during development or deploy it to their own infrastructure when moving to production. From there, workflows can be inspected, debugged, and replayed through a dashboard or directly with Amber's CLI tool.

<h3 class="sh" id="sdk">SDK</h3>

Amber provides a simple Python SDK that serves as the entry point to durable execution. Developers import the Amber library and annotate their agent code to register their agent as a durable workflow. Behind those SDK decorators, Amber handles the work of checkpointing steps, recovering after failure, and integrating traces.

<img src="img/amber-sdk-code.png" alt="Python SDK example showing an OpenAI Agents SDK research assistant registered as a durable Amber workflow." style="display:block;width:75%;height:auto;margin:1.5rem auto;">

For additional setup instructions and and SDK details see the amber-sdk README:
[Link: amber-sdk-README](https://github.com/amber-runtime/amber/blob/main/sdk/README.md)

<h3 class="sh" id="dashboard">Dashboard</h3>

Amber provides a dashboard for managing and debugging durable workflows. The dashboard allows for agent-specific tracing by using OpenAI Agent SDK’s own TracingProcessor API.

<div class="case-carousel" data-carousel aria-label="Amber dashboard walkthrough">
  <div class="case-carousel__viewport">
    <button class="case-carousel__arrow case-carousel__arrow--prev" type="button" data-carousel-prev aria-label="Previous dashboard step">&#8249;</button>
    <div class="case-carousel__slides">
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Amber Dashboard</h4>
        <div class="case-carousel__frame">
          <img src="img/dashboard/dashboard-1.png" alt="Dashboard home screen." loading="lazy">
        </div>
        <figcaption>Amber dashboard home screen</figcaption>
      </figure>
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Amber Workflow Page</h4>
        <div class="case-carousel__frame">
          <img src="img/dashboard/dashboard-2.png" alt="Dashboard workflow page." loading="lazy">
        </div>
        <figcaption>Evaluate an errored workflow.</figcaption>
      </figure>
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Review Errored Workflow</h4>
        <div class="case-carousel__frame">
          <img src="img/dashboard/dashboard-3.png" alt="Dashboard review screen." loading="lazy">
        </div>
        <figcaption>Review where errored workflow happened and the reason for it.</figcaption>
      </figure>
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Analyze Workflow Error</h4>
        <div class="case-carousel__frame">
          <img src="img/dashboard/dashboard-4.png" alt="Analyze workflow error" loading="lazy">
        </div>
        <figcaption>Once error is found go into code to fix.</figcaption>
      </figure>
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Fork New Workflow</h4>
        <div class="case-carousel__frame">
          <img src="img/dashboard/dashboard-5.png" alt="Fork Button" loading="lazy">
        </div>
        <figcaption>Once error is fixed, fork the errored workflow so the new run will rerun with same state to verify error was fixed.</figcaption>
      </figure>
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Successful Fix</h4>
        <div class="case-carousel__frame">
          <img src="img/dashboard/dashboard-6.png" alt="Dashboard shows fix corrected errored workflow." loading="lazy">
        </div>
        <figcaption>See that the fix was successful</figcaption>
      </figure>
    </div>
    <button class="case-carousel__arrow case-carousel__arrow--next" type="button" data-carousel-next aria-label="Next dashboard step">&#8250;</button>
  </div>
  <div class="case-carousel__dots" aria-label="Dashboard walkthrough steps">
    <button type="button" data-carousel-dot aria-label="Show step 1"></button>
    <button type="button" data-carousel-dot aria-label="Show step 2"></button>
    <button type="button" data-carousel-dot aria-label="Show step 3"></button>
    <button type="button" data-carousel-dot aria-label="Show step 4"></button>
    <button type="button" data-carousel-dot aria-label="Show step 5"></button>
    <button type="button" data-carousel-dot aria-label="Show step 6"></button>
  </div>
</div>

From a failed workflow, developers can inspect completed steps and resume from any previously completed step to replay part of the workflow. This allows developers to investigate failures without rerunning the entire workflow.

Developers can add logs, make code changes, and replay failed sections to understand what went wrong.

<h3 class="sh" id="cli">CLI</h3>

Amber also exposes the dashboard’s API through the CLI tool.

<div class="case-carousel case-carousel--cli" data-carousel aria-label="Amber CLI walkthrough">
  <div class="case-carousel__viewport">
    <button class="case-carousel__arrow case-carousel__arrow--prev" type="button" data-carousel-prev aria-label="Previous CLI step">&#8249;</button>
    <div class="case-carousel__slides">
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Agents in Amber CLI</h4>
        <div class="case-carousel__frame">
          <img src="img/CLI/cli-1.png" alt="Amber CLI command output in a terminal." loading="lazy">
        </div>
        <figcaption>Use an agent like Claude to inspect Amber workflow data from the terminal through the provided workflows command.</figcaption>
      </figure>
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Inspect Workflows</h4>
        <div class="case-carousel__frame">
          <img src="img/CLI/cli-2.png" alt="CLI workflow inspection output showing workflow details." loading="lazy">
        </div>
        <figcaption>List and inspect workflows.</figcaption>
      </figure>
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Debug Workflow State</h4>
        <div class="case-carousel__frame">
          <img src="img/CLI/cli-3.png" alt="CLI debugging output showing workflow state and error context." loading="lazy">
        </div>
        <figcaption>Review workflow state and error context directly in the CLI and ask follow up questions if you want more detail.</figcaption>
      </figure>
      <figure class="case-carousel__slide" data-carousel-slide>
        <h4>Review Workflow Information</h4>
        <div class="case-carousel__frame">
          <img src="img/CLI/cli-4.png" alt="Review Workflow Information." loading="lazy">
        </div>
        <figcaption>Review the workflow information returned.</figcaption>
      </figure>
    </div>
    <button class="case-carousel__arrow case-carousel__arrow--next" type="button" data-carousel-next aria-label="Next CLI step">&#8250;</button>
  </div>
  <div class="case-carousel__dots" aria-label="CLI walkthrough steps">
    <button type="button" data-carousel-dot aria-label="Show step 1"></button>
    <button type="button" data-carousel-dot aria-label="Show step 2"></button>
    <button type="button" data-carousel-dot aria-label="Show step 3"></button>
    <button type="button" data-carousel-dot aria-label="Show step 4"></button>
  </div>
</div>

This allows the developers to manage and debug their agent workflows directly from the terminal. They can even direct a coding agent to query agent workflows and debug on their behalf.
