# Openshift Workshop: Openshift JBoss EAP using S2I

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Common use case

Artifacts are already built and available on Nexus / Artifactory.

The goal is to deploy an application using prebuilt artifacts.

---

## Possible solutions

* Generic docker build and store the image on a private registry.
* Openshift build with --strategy=docker
* **Openshift build with --strategy=source + JBoss EAP**

---

## Repetition: S2I Workflow

1. Builder image: jboss-eap71
2. Assemble step: Results in image
3. Run step: Started by Openshift

---

## JBoss EAP S2I assemble step

### Step 1

S2I Scripts are checking for a `pom.xml` file.

If present, `mvn build -DskipTests` is run.

Artifacts (.jar, .war, .ear) are copied from `target` directory to `$EAP_HOME/standalone/deployments` directory.

---

## Step 2

Artifacts (.jar, .war, .ear) are copied from `./` to `$EAP_HOME/standalone/deployments` directory.

---

## Step 3

Artifacts (.jar, .war, .ear) are copied from `./deployments` to `$EAP_HOME/standalone/deployments` directory.

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

## How to use: Create a new BuildConfig and trigger a build

`oc new-build registry.access.redhat.com/jboss-eap-7/eap71-openshift~. --name jboss-app`

