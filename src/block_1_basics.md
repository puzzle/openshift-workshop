# Openshift Workshop

<small>04.10.2018 - tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Agenda

### Day 1

* Introduction
* Openshift: Basics
* Openshift: Basic Exercises
* Openshift: S2I Builds
* Openshift: Templates

### Day 2

* CI/CD
* ...

<!-- .slide: class="master02" -->

---

## Introduction

---

## Openshift: Basics

* *Openshift* Image, ImageStream, ImageStreamTag, ImageStreamImage
* *Openshift* Build, BuildConfiguration
* *Openshift* Deployment, DeploymentConfiguration, Pod, ReplicationController
* *Openshift* Services, Routes
* *Openshift* Templates

---

## Openshift: ImageStream

An Openshift `ImageStream` is a collection of `ImageStreamImage`.

An `ImageStreamImage` can have 0 or more `ImageStreamTag`

Roughly comparable to Docker Image Repository.

----

## Openshift: ImageStreamImage

`ImageStreamImage`s are referenced by a uuid.

----

## Openshift: ImageStreamTag

In practice, you will usually reference a `ImageStreamImage` by one of its `ImageStreamTag`s.

Commonly used tags:

* `latest` - builds use this tag by default.
* `dev`
* `test`
* `1.0.6`
* `1`

----

## How to get images

* Dockerhub images are usually blocked!
* Dockerhub images are usually not compatible (main reason: Openshift images won't run as root!)

* Openshift compatible images by RedHat https://access.redhat.com/containers/
* Get a openshift compatible image from one of your trusted docker registries.
* Openshift Build: Dockerfile
* Openshift Build: S2I

----

## Openshift Image creation guidelines

https://docs.openshift.com/container-platform/3.11/creating_images/guidelines.html

Take outs:

* Openshift won't run as root user
* Support arbitary user ids
* Openshift specific meta data with `LABEL`
* Log to stdout (not in files)
* Liveness and Readiness probes
* Consider providing a template for your images

----

## ImageStreams: Useful commands

`oc get is`

`oc get is -n openshift`

`oc delete is/my-image-stream`

---

## Openshift: Builds

An Openshift build results in an image.
The image is (by default) stored in your namespace in an `ImageStream` called `BUILDNAME:latest`

Example:

`oc new-build httpd --name kt-static-site --binary`

`oc start-build kt-static-site --from-dir=. --follow`

Will build an image and store in the `ImageStream` "kt-static-site" and tag it with "latest".

----

## Openshift Build: Input

An Openshift Build *ALWAYS* consists of:

* Builder image (provided in `BuildConfig`)
* Source (provided during `Build`)

----

## Openshift Build: Commonly used parameters

* Output Target (`ImageStream` or external Docker registry)
* Environment Variables used during build
* Triggers

----

## Openshift Build: Further reading

https://docs.openshift.com/online/dev_guide/builds/index.html
https://docs.openshift.com/online/dev_guide/builds/triggering_builds.html

----

## Openshift Build: Build strategies

* source (S2I build - will look for S2I scripts)
* docker (will look for Dockerfile in source)
* pipeline (inline Jenkins pipeline)

----

## Openshift Build: Futher reading

API Documentation for BuildConfig:
https://docs.openshift.com/container-platform/3.7/rest_api/apis-build.openshift.io/v1.BuildConfig.html

----

## Openshift: Build examples (1)

`oc new-build httpd --name kt-static-site --binary`

`oc start-build kt-static-site --from-dir=. --follow`

* Builder image: httpd
* Source: local directory `.`
* Strategy: source

----

## Openshift: Build examples (2)

`oc new-build https://github.com/tran-engineering/openshift-workshop-nodejs-example --name kt-nodejs-example`

* Builder image: registry.access.redhat.com/rhscl/nodejs-8-rhel7 (parsed from Dockerfile)
* Source: https://github.com/tran-engineering/openshift-workshop-nodejs-example
* Strategy: docker

---

## Openshift: Build commands

`oc get bc`

`oc get bc/my-build`

`oc delete bc/my-build`

`oc new-build --help`

`oc start-build --help`

`oc env bc/my-app SOME_ENV=hello`

---

## Openshift: Deployment

An Openshift deployment runs a specific image.

----

## Openshift Deployment: Commonly used parameters

* Image to run (usually an Imagestream + Tag)
* Environment variables in the running Pod
* Triggers (ImageChange / ConfigChange)
* Exposed ports (Usually derived from Dockerfile)
* Resource limits (CPU / Memory)
* Liveliness / Readiness probes
* Deployment strategy (Rolling, Recreate, Custom)

----

## Openshift Deployment: Triggers

By default, a new Deployment is triggered when the `ImageStreamTag` points to a new image or the `DeploymentConfig` has changed.

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

## Resource Limits

The platform usually sets default limits.
Openshift will *kill* processes that use memory.

----

## Deployment strategies

* Rolling (default) - scales up the new replication controller in stages, gradually reducing the number of old pods. If one of the new deployed pods never becomes "ready", the new rollout will be rolled back (scaled down to zero). Use when your application can tolerate two versions of code running at the same time (many web applications, scalable databases)  

* Recreate - scales the old replication controller down to zero, then scales the new replication controller up to full. Use when your application cannot tolerate two versions of code running at the same time.

* Custom - run your own deployment process inside a Docker container using your own scripts.

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

`oc env dc/my-app SOME_ENV=hello`

---

## Openshift Services

https://docs.openshift.com/container-platform/3.10/architecture/core_concepts/pods_and_services.html#services

Internal Load Balancer. Proxies using an internal proxy ip to the concrete pods.
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

