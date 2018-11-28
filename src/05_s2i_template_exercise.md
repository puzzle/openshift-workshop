# Openshift Workshop: Template Exercises

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Exercise 1: List all templates provided by the openshift platform

`oc get templates -n openshift`

Those templates are the same as you can see on the web console.
An Openshift Cluster-Admin can add new templates to the **openshift** namespace.

---

## Exercise 2: Show template parameters

`oc process openshift//postgresql-ephemeral --parameters`

This shows all possible parameters for this template and its default values.

---

## Exercise 2a: Compare with another template

`oc process openshift//postgresql-persistent --parameters`

---

## Exercise 3: Display a processed template

`oc process openshift//postgresql-ephemeral -p POSTGRESQL_USER=user -p POSTGRESQL_PASSWORD=pass`

Use this to do *"dry-run"* and analyze what Openshift would create.

---

## Exercise 4: Create objects using `oc create -f -`

`oc process openshift//postgresql-ephemeral -p POSTGRESQL_USER=user -p POSTGRESQL_PASSWORD=pass | oc create -f -`

---

## Exercise 5: Create objects using `oc new-app --template=...`

`oc new-app --template=postgresql-ephemeral --param POSTGRESQL_USER=user --param POSTGRESQL_PASSWORD=pass --param DATABASE_SERVICE_NAME=postgres-by-new-app`

---

## Exercise 6: Make your own template

Clean up your project (`oc delete all --all`)

`oc new-app https://github.com/tran-engineering/openshift-workshop-nodejs-example.git --name=myapp HELLO_MSG="Thanks for all the fish"`

`oc export --raw svc,dc,bc,is -l app=myapp -o yaml --as-template=myapp-template > myapp-template.yaml`

----

## Try to make HELLO_MSG configurable as template parameter

Add a parameter to your template:

```yaml
parameters:
  - name: MESSAGE
    displayName: Custom message
    description: Custom message shown on an REQUEST
    value: Hello, this is a default value.
    required: false
```

----

Replace the ENV variable:

```yaml
[...]
        - env:
          - name: HELLO_MSG
            value: ${MESSAGE}
[...]
```

----

Cleanup your current project:

`oc delete all --all`

----

## Double check your template

Check to see if the parameters block is working:
`oc process -f myapp-template.yaml --parameters`

Check to see if the parameters are set:
`oc process -f myapp-template.yaml -p MESSAGE="This message is set by a template parameter" | grep -C 5 HELLO_MSG`

----

## Rebuild it using template:

`oc process -f myapp-template.yaml -p MESSAGE="This message is set by a template parameter" | oc create -f -`

Manually start a build (builds aren't triggered on import):

`oc start-build myapp`

---

## Exercise 7: Have a look at other templates

* django-psql-example
* dotnet-example
* mariadb-ephemeral
* mongodb-ephemeral
* mysql-ephemeral
* nodejs-mongodb-example
* postgresql-ephemeral
* rails-postgresql-example

----

Look at template parameters:

`oc process openshift//django-psql-example --parameters`

Create the resources:

`oc process openshift//django-psql-example | oc create -f`

or shorthand

`oc new-app --template=django-psql-example`

