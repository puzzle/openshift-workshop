# Openshift Workshop: MS SQL

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## MS SQL Server on Openshift

https://developers.redhat.com/blog/2018/09/25/sql-server-on-openshift/

---

## Add imagestreams and templates

`oc create -f https://raw.githubusercontent.com/tmds/dotnet-mssql-ex/master/openshift/imagestreams.json`

`oc create -f https://raw.githubusercontent.com/tran-engineering/mssql-ephemeral-template/master/mssql-ephemeral.json`

---

## Add a deployment config

`oc process mssql-ephemeral ACCEPT_EULA=Y MSSQL_SA_PASSWORD=testTest! NAMESPACE= | oc create -f -`

---

## Connect to your database

`oc get pods`

`oc get pods -l name=mssql`

`oc port-forward POD-NAME 1433:1433`

`oc rsh POD-NAME`

`sqlcmd -S localhost -U SA -P testTest!`

---