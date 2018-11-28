# Openshift Workshop

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Workshop resources

https://puzzle.github.io/openshift-workshop

---

## Goals

* Learn about basics
* Gain experience working with **your** Openshift platform

---

## Agenda

### Day 1

* Introduction
* Openshift: Basics
* Exercises: Openshift Basics
* Openshift: S2I Builds
* Openshift: Templates
* Exercises: Openshift S2I / Templates

<!-- .slide: class="master02" -->

----

### Day 2

* Openshift + JBoss EAP
* Exercises

* Jenkins
* Exercises

<!-- .slide: class="master03" -->

---

## Introduction

---

## Openshift: Basics

* *Openshift* ImageStream, ImageStreamImage, ImageStreamTag
* *Openshift* Build, BuildConfiguration
* *Openshift* Deployment, DeploymentConfiguration, Pod
* *Openshift* Services, Routes
* *Openshift* Secrets

---

## Openshift: ImageStream

An Openshift `ImageStream` is a collection of `ImageStreamImage`.

An `ImageStreamImage` can have 0 or more `ImageStreamTag`

Roughly comparable to Docker Image Repository.

----

## Openshift: ImageStreamTag

In practice, you will usually reference a `ImageStreamImage` by one of its `ImageStreamTag`

Commonly used tags:

* `latest` - builds tag this by default
* `dev`
* `test`
* `1.0.6`
* `1`

----

## How to get images

* Dockerhub images are usually blocked!
* Dockerhub images are usually not compatible (main reason: Openshift images won't run as root!)

* Openshift compatible images by RedHat https://access.redhat.com/containers/
* Your private registry
* Openshift builds: Dockerfile (`--strategy=docker`), S2I (`--strategy=source`)

----

## Openshift Image creation guidelines

https://docs.openshift.com/container-platform/3.11/creating_images/guidelines.html

----

Take outs:

* Openshift won't run images as root (uid=0)
* Support arbitary user ids in your images
* Log to stdout (not in files)
* Support Liveness and Readiness probes
* Consider providing a template for your images

----

## ImageStreams: Useful commands

`oc get is`

`oc get is -n openshift`

`oc delete is/my-image-stream`

`oc describe -n openshift is/httpd`

---

## Openshift: Builds

An Openshift build results in an image.
The image is (by default) stored in your namespace in an `ImageStream` called `BUILDNAME:latest`

----

### Example:

Create a BuildConfig:

`oc new-build registry.access.redhat.com/rhscl/httpd-24-rhel7 --name static-site --binary`

----

Trigger a build:

`oc start-build static-site --from-dir=. --follow`

Will build an image and store in the `ImageStream` "static-site" and tag it with "latest".

----

## Openshift Build: Input

An Openshift Build *ALWAYS* consists of:

* Builder image (provided in `BuildConfig`)
* Source (provided during `Build`)

----

## Openshift Build: Commonly used parameters

* Output Target (`ImageStream` or external Docker registry)
* Environment Variables used during build
* Triggers (BuildConfig change, BuilderImage Change, Webhooks)

----

## Openshift Build: Further reading

https://docs.openshift.com/online/dev_guide/builds/index.html
https://docs.openshift.com/online/dev_guide/builds/triggering_builds.html

----

## Openshift Build: Build strategies

* source (S2I build, requires a S2I compatible builder image)
* docker (will look for a provided `Dockerfile` in source or inline)
* pipeline (inline Jenkins pipeline)

----

## Openshift Build: Futher reading

API Documentation for BuildConfig:
https://docs.openshift.com/container-platform/3.7/rest_api/apis-build.openshift.io/v1.BuildConfig.html

----

## Openshift: Build examples (1)

`oc new-build registry.access.redhat.com/rhscl/httpd-24-rhel7 --name static-site --binary`

`oc start-build kt-static-site --from-dir=. --follow`

* Builder image: registry.access.redhat.com/rhscl/httpd-24-rhel7
* Source: local directory `.`
* Strategy: source

----

## Openshift: Build examples (2)

`oc new-build https://github.com/tran-engineering/openshift-workshop-nodejs-example --name nodejs-app`

* Builder image: registry.access.redhat.com/rhscl/nodejs-8-rhel7 (parsed from Dockerfile)
* Source: https://github.com/tran-engineering/openshift-workshop-nodejs-example
* Strategy: docker

----

## Openshift: Build commands

`oc get bc`

`oc get bc/my-build`

`oc delete bc/my-build`

`oc set env bc/my-app SOME_ENV=hello`

`oc describe bc/my-build`

---

## Openshift: Deployment

An Openshift deployment runs a specific image.

----

## Openshift Deployment: Commonly used parameters

* Image to run (usually an Imagestream + Tag)
* Environment variables in the running Pod
* Triggers (Image changes / DeploymentConfig changes)
* Exposed ports (Usually derived from Dockerfile)
* **Resource limits** (CPU / Memory)
* **Liveliness / Readiness probes**
* **Deployment strategy** (Rolling, Recreate)

----

## Resource Limits

The platform usually sets default limits.
Openshift will *kill* processes that use memory.

----

## Readiness vs Liveliness probes

Used for load balancing.

If the liveliness probe fails, the container is killed (and a new one is spawned).

If the Readiness probe fails, the container won't receive any traffic from the load balancer.

----

## Type of probes

* HTTP GET
* Container command
* TCP Socket


----

## Deployment strategies

* Rolling (default) - Use when your application can tolerate two versions of code running at the same time (many web applications, scalable databases)  

* Recreate - Use when your application cannot tolerate two versions of code running at the same time (database schema changes, migrations, ...)

----

## Openshift Deployment: Further reading

### General info about Openshift deployments

https://docs.openshift.com/container-platform/3.9/dev_guide/deployments/how_deployments_work.html

### Resource limits

https://docs.openshift.com/container-platform/3.11/dev_guide/compute_resources.html

----

## Openshift Deployment: commands

`oc get dc`

`oc get dc/my-deployment`

`oc delete dc/my-deployment`

`oc new-app -i my-app`

`oc new-app -i my-app -e SOME_ENV=hello`

`oc set env dc/my-app SOME_ENV=hello`

---

## Openshift Services

https://docs.openshift.com/container-platform/3.10/architecture/core_concepts/pods_and_services.html#services

Internal Load Balancer. Maps an internal ip to the concrete pods.
Service ports are inferred when the deployment config is created.

---

## Openshift Routes

https://docs.openshift.com/container-platform/3.10/architecture/networking/routes.html

Proxies external requests to Services.

---

## Best practice: Read (parts of) the documentation

### Guide for developers

https://docs.openshift.com/container-platform/3.10/dev_guide/index.html

Strongly recommended to read!

---

## Questions