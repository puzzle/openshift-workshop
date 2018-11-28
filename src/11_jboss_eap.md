# Openshift Workshop: Openshift JBoss EAP using S2I

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

### Day 2

* Openshift + JBoss EAP
* Exercises

* Jenkins
* Exercises

<!-- .slide: class="master03" -->

---

## Common use case

Artifacts are already built and available on Nexus / Artifactory.

The goal is to deploy an application using **prebuilt artifacts**.

---

## Possible solutions

* Generic docker build and store the image on a private registry.
* Openshift build with --strategy=docker
* **Openshift build with --strategy=source + JBoss EAP**

---

## Repetition: S2I Workflow

1. Builder image: *registry.access.redhat.com/jboss-eap-7/eap71-openshift*
2. Assemble step: Results in image
3. Run step: Started by Openshift

---

## JBoss EAP S2I assemble step

### Step 1

S2I Scripts are checking for a `pom.xml` file.

If present, `mvn build -DskipTests` is run.

----

After the build:

Artifacts (.jar, .war, .ear) are then copied from `target` directory to `$EAP_HOME/standalone/deployments` directory.

---

## Step 2

Artifacts are copied from `./` to `$EAP_HOME/standalone/deployments` directory.

---

## Step 3

Artifacts are copied from `./deployments` to `$EAP_HOME/standalone/deployments` directory.

---

## Step 4

All files from `./configuration` are copied to `$EAP_HOME/standalone/configuration`.

If you want to use a custom JBoss EAP file, it should be named *standalone-openshift.xml*

---

## Step 5

All files in `./modules` are copied to `$EAP_HOME/modules`

---

## How to use: Prepare your S2I sources

1. Gather your artifacts
2. Put them in a directory called /deployments
3. (optional) Put required JBoss modules in /modules
4. (optional) `standalone-openshift.xml` in /configuration

---

## How to use: Create Deployment using S2I

1. Create *BuildConfig*
`oc new-build registry.access.redhat.com/jboss-eap-7/eap71-openshift~. --name jboss-app`

2. Create *DeploymentConfig*, *Routes*, etc.

---

## Links

[JBoss EAP S2I Documentation](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/red_hat_jboss_enterprise_application_platform_for_openshift/)


[Customizing S2I Build](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/red_hat_jboss_enterprise_application_platform_for_openshift/reference_information#reference_s2i)

