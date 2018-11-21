# Openshift Workshop: Templates

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Openshift Templates

https://docs.openshift.com/container-platform/3.11/dev_guide/templates.html

A template describes a **set of objects** that can be **parameterized** and **processed** to produce a **list of objects** for creation by OpenShift Container Platform.

---

## Base MO

Template + User provided parameters => IS, BC, DC, Routes, Secrets, ...

---

## Why use templates?

* Restrict what users can customize
* Simplify creation of multiple objects at the same time
* Tightly control and configure objects attributes
* Allow creation of complex setups using the web console

---

## When to use templates?

* Creation of a single service (like a DB)

* Creation of a whole working application stacks

* Creation of builds/imagestreams: e.g. https://github.com/tmds/dotnet-mssql-ex/

---

Create a whole application stack (app server, db server):

* BuildConfig
* DeploymentConfig
* Environment variables
* Secrets
* Persistent Volume Claims
* Routes

----

## Possible template parameters

Maybe allow the user to define:

* Build source
* Target ImageStream / Docker registry
* Database credentials
* Resource limits
* Volume sizes

---

