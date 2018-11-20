# Openshift Workshop

<small>04.10.2018 - tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Openshift Templates: Exercises

---

## Exercise 1: List all templates

`oc get templates -n openshift`

Those templates are the same as you can see on the web console.
An Openshift Cluster-Admin can add new templates to the *openshift* Namespace.

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

`oc new-app https://github.com/tran-engineering/openshift-workshop-nodejs-example.git --name=myapp HELLO_MSG="Thanks for all the fish!"`

`oc export svc,dc,bc,is -l app=myapp -o yaml --as-template=myapp-template > myapp-template.yaml`

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

Rebuild it using template:

`oc process -f myapp-template.yaml -p MESSAGE=hey | oc create -f -`