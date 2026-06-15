---
id: "durable"
order: 1
num: "01"
label: "Durable execution"
screenLabel: "What is Durable Execution?"
title: "What is Durable Execution?"
---
Unlike normal code execution, durable execution persists its progress as it runs and, after a crash, resumes from that saved progress rather than starting over. Conceptually, from the developer's point of view, the application's execution flow behaves as if the failure had never happened. To clarify though, durable execution does not imply that failures do not happen, or that they happen less.

It's worth identifying what's normally lost when an application crashes. The failed process loses not only the in-memory state, such as variable values, but also the awareness of which steps had already run and which one was meant to run next. Normal execution that doesn't preserve state has little choice but to start over from the beginning.

For example, consider code that executes a sequence of five steps where crashes can happen mid-operation at any step.

<img src="img/amber-double-charge.svg" alt="A naive restart re-runs the charge step and charges the customer twice." style="display:block;width:100%;height:auto;margin:1.5rem auto;">
