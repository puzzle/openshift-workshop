----

### Labels

Every openshift object can have labels. It is strongly recommended to use them!
`oc get all -l name=postgres`
`oc delete all -l name=postgres`

----

### ImageStreams

> An ImageStream groups sets of related docker images under tags.

Comparable to: dockerhub repositories (e.g. openjdk)

---

### BuildConfig / Build

> Contains a description of how to build source code and a base image into a new image.

Takes source / binaries and creates a docker image and pushes it to openshift internal image registry.

----

### DeploymentConfig / Deployment

> Defines the template for a pod and manages deploying new images or configuration changes whenever those change.

Takes image and deploys it (creates pods).

----

### Volumes

----

### Persistent Volume

### Persistent Volume Claim

----

### Routes

----

### Pods
> A set of one or more containers that are deployed onto a Node together and share a unique IP and Volumes (persistent storage). Pods also define the security and runtime policy for each container.

---

## 12-factor apps

https://12factor.net/

----

1. Codebase: One codebase tracked in revision control, many deploys
2. *Dependencies*: Explicitly declare and isolate dependencies
3. *Config*: Store config in the environment
4. *Backing services*: Treat backing services as attached resources
5. *Build, release, run*: Strictly separate build and run stages
6. Processes: Execute the app as one or more stateless processes
7. *Port-Binding*: Export services via port binding
8. Concurrency: Scale out via the process model
9. Disposability: Maximize robustness with fast startup and graceful shutdown
10. Dev/prod parity: Keep development, staging, and production as similar as possible
11. *Logs*: Treat logs as event streams
12. Admin processes: Run admin/management tasks as one-off processes

----

## Dependencies

### Do

* Dependencies explicitely in codebase (pom.xml, gradle.build, package(-lock).json, Gemfile)

### Don'ts

* Dependency on system-wide packages for building (globally installed gulp, compass, etc.)
* Dependency on system tools for building (curl, wget, imagemagick)

----

## Config

### Do

* (Sensitive) configuration in environment variables

### Don'ts

* Configuration in files

----

## Backing Services

### Do

* DB URLs in configuration

### Don'ts

* DBs or other services in application container

----

## Build, release, run

### Do

* Strictly seperate build, release, run stages.
* Every build has an ID (build number, timestamp...)

### Don'ts

* Everything in one step

----

## Port-Binding

### Do

* Every service exposes one (or more) ports

### Don'ts

* Binding only localhost
* Binding specific IPs

----

## Logs

### Do

* Log to stdout

### Don'ts

* Log to files

---

## Your first deployment

## Magic command: `oc new-app`

Creates a running application from:

* Image
* Imagestream
* Templates
* Source code location

Search for possible sources:

e.g. `oc new-app -S postgres`

----

## `oc new-app` from an image

`oc new-app registry.access.redhat.com/rhscl/httpd-24-rhel7`

----

## What happened?

* Creation of Imagestream
* Creation of DeploymentConfig
* Creation of Service

* More information:

`oc new-app registry.access.redhat.com/rhscl/httpd-24-rhel7 -o yaml`

----

## Pitfalls using `oc new-app IMAGE`

* The docker registry is not whilelisted. (especially `dockerhub.com`)
 * Default whitelists: RedHat docker registry
* The image is not openshift compatible:
 * root user
 * file permissions

---

## `oc new-app` from templates

* TODO Describe what this does!

`oc new-app --template=postgresql-ephemeral`

----

## Template parameters

Get possible template parameters:

`oc process openshift//postgresql-ephemeral --parameters`

Set template parameters:

`oc new-app --template=postgresql-ephemeral -p POSTGRESQL_USER=dbuser -p POSTGRESQL_PASSWORD=dbpass -p POSTGRESQL_VERSION=9.6`

Set template parameters with a file:

`oc new-app --template=postgresql-ephemeral --param-file postgres.env`

---

## `oc new-app` from source code location

* TODO Describe what this does!

`oc new-app https://github.com/tran-engineering/openshift-workshop-nodejs-example.git`

---

## `oc new-build`

### Create BuildConfig

`oc new-build httpd --binary --name static-site`

Will push images to is/static-site:latest.

Override this by using `-o <IMAGESTREAM>:<TAG>`

`oc new-build httpd --binary --name static-site --to=static-site:dev`

### Create DeploymentConfig

`oc new-app static-site --allow-missing-imagestream-tags`

----

## `oc start-build`

`echo hello world > index.html`
`oc start-build static-site --from-dir=.`

----

## Expose the service

`oc create service clusterip static-site --tcp=80:8080`

`oc create route edge static-site --service=static-site`

---

## What happened?

* BuildConfig created
* Imagestream created
* DeploymentConfig created
* Service Created

---

## Openshift: Basics

* *Openshift* Imagestreams
* *Openshift* Builds
* *Openshift* Deployments
* *Openshift* Routes
* *Openshift* Templates

---

## Openshift: Imagestreams

Images are needed for deployments.
Imagestreams group images together using a name + tag.

Similar to Dockerhub Repositories (e.g. `docker run --rm -ti openjdk:11-alpine java -version`)

----

## Openshift Imagestream: Pitfalls

* Dockerhub images are usually blocked!
* Dockerhub images are usually not compatible (main reason: Openshift images won't run as root!)

=> How to get images?

* Openshift compatible images by RedHat https://access.redhat.com/containers/?count=10#/category/Standalone%20Image
* Get a openshift compatible image from one of your trusted docker registries.
* Build images from Dockerfile using Openshift Build
* Build images using S2I using Openshift Build

---

## Openshift: Builds

Source (not necessarly code) + Buildconfig = Build #n

When Build #n results in Image

Image is stored by default in an image stream with tag `latest`.

----

## Do I need Openshift Builds?

Questions:
Do I want to build an image on the openshift platform and push the image to the registry?
Is an openshift compatible image already available somewhere else?

----

## Openshift: Build Commands

`oc new-build (IMAGE | IMAGESTREAM | PATH | URL ...) [options]`

----

## oc new-build IMAGE

`oc new-build nginx:latest`

Tries to create an image stream from a Dockerhub image.

==> Will fail if Dockerhub is not a trusted image source.

----

## oc new-build IMAGESTREAM

`oc new-build nginx --binary`

Tries to create an buildconfig from

---

## Best practice: Read (parts of) the documentation

### Guide for developers

https://docs.openshift.com/container-platform/3.10/dev_guide/index.html

Strongly recommended to read!

---

## Openshift: JBoss EAP applications

Let's create your personal playground:

`oc new-project [username]-sandbox`

Command to delete your project:

`oc delete project [username-sandbox]`

---

---

### Best practice: Use RedHat xPaaS images

https://access.redhat.com/documentation/en-us/red_hat_jboss_middleware_for_openshift/3/

---

Used to separate all openshift objects.
Every project has also an image registry.

Comparable to: Kubernetes Namespaces

`oc new-project my-project`

`oc delete project my-project`

`oc new-app postgres -n my-project`

---
