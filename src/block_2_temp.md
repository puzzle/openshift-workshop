# Openshift Workshop

<small>04.10.2018 - tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Agenda

### Day 1

* Openshift: Words and Definitions
* 12-factor apps: What is this?
* Your first deployment
* MS SQL Server on Openshift

### Day 2

* CI/CD
* ...

<!-- .slide: class="master02" -->

---

## MS SQL Server on Openshift

https://developers.redhat.com/blog/2018/09/25/sql-server-on-openshift/

---

## Add imagestreams and templates

`oc create -f https://raw.githubusercontent.com/tmds/dotnet-mssql-ex/master/openshift/imagestreams.json`

`oc create -f https://raw.githubusercontent.com/tran-engineering/mssql-ephemeral-template/master/mssql-ephemeral.json`

---

## Add a deployment config

`oc process mssql-ephemeral ACCEPT_EULA=Y MSSQL_SA_PASSWORD=testTest! NAMESPACE=kt-mssql | oc create -f -`

---

## Connect to your database

`oc get pods`

`oc get pods -l name=mssql`

`oc port-forward POD-NAME 1433:1433`

---

---

## Openshift: JBoss EAP applications

Let's create your personal playground:

`oc new-project [username]-sandbox`

Command to delete your project:

`oc delete project [username-sandbox]`

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

