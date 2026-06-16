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

<img src="img/amber-sdk-code.png" alt="Python SDK example showing an OpenAI Agents SDK research assistant registered as a durable Amber workflow." style="display:block;width:100%;height:auto;margin:1.5rem auto;">

For additional setup instructions and and SDK details see the amber-sdk README:
[Link: amber-sdk-README](https://github.com/amber-runtime/amber/blob/main/sdk/README.md)

<h3 class="sh" id="dashboard">Dashboard</h3>

Amber provides a dashboard for managing and debugging durable workflows.

[Probably a forking video or carousel showing how to use that feature. Placeholder for now]

From a failed workflow, developers can inspect completed steps and fork from any previously completed step to replay part of the workflow. This allows developers to investigate failures without rerunning the entire workflow.

This capability makes debugging agent workflows on Amber closer to debugging traditional software. Developers can add logs, make code changes, and replay failed sections to understand what went wrong.

<h3 class="sh" id="cli">CLI</h3>

Amber also exposes the dashboard’s API through the CLI tool.

[Same thing carousel or little video of using the cli to get workflows with claude. Placeholder for now]

This allows the developers to manage and debug their agent workflows directly from the terminal. They can even direct a coding agent to query agent workflows and debug on their behalf.

