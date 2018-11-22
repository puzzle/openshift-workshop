# Openshift Workshop: Exercise

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Prerequesities

### Install the Openshift Client (oc)

https://console.os1.balgroupit.com/console/command-line

---

### Best practices

* Put it in your **PATH**
* Have a working **git** binary (proxy settings!)
* Bash/zsh completion: `oc completion --help`

---

## Oh shit I messed up! Let's start from scratch

Check that you are in the correct project:

`oc project`

`oc delete all --all`

---

## Exercise 1: Create/Select your project

`oc login`

`oc new-project workshop-USERNAME` (only if you have rights)

`oc project workshop-USERNAME`

---

## Exercise 2: Create a BuildConfig + binary deployment

### Create a new BuildConfig

`oc new-build --binary registry.access.redhat.com/rhscl/httpd-24-rhel7 --name static-site`

----

### Create a simple static html directory

`mkdir static-site`

`echo hello world > static-site/index.html`

### Build an image from source

`oc start-build static-site --from-dir=static-site --follow`

Resulting image will be pushed to *static-site:latest*

----

### Check what Openshift has generated

`oc get all -l build=static-site`

### Create a deployment config

`oc new-app --image-stream=static-site`

### Create a route

`oc create route edge static-site --service=static-site`

----

### Show the generated URL

`oc describe route/static-site`

... visit that URL using your browser!

----

### Shorthand to create BuildConfig + start build --from-dir=.

`oc new-build registry.access.redhat.com/rhscl/httpd-24-rhel7~. --name=static-site`

---

## Exercise 3: Create a Dockerfile build + binary deployment

### Create a Dockerfile

`mkdir nodejs-app; cd nodejs-app`

```Dockerfile
# Base RHEL image
FROM registry.access.redhat.com/rhoar-nodejs/nodejs-8

# Copy --from-dir / --from-source to container
ADD . /app

WORKDIR /app

EXPOSE 8080

CMD node server.js
```

----

### Create server.js file

```javascript
const http = require('http')
http.createServer(function (req, res) {
  console.log(new Date(), req.method, req.url)

  res.writeHead(200, {'Content-Type': 'text/plain'})

  res.end(process.env.HELLO_MSG || 
    'Hello! Please try to set the environment variable: HELLO_MSG!')
}).listen(8080)

console.log('Server listening on :8080...')
```

----

### Create a BuildConfig + start a Build

`oc new-build . --name nodejs-app`

`oc start-build nodejs-app --from-dir=. --follow`

----

### Create a `DeploymentConfig`

Try to do it yourself! See Exercise 2.

### Check your browser

Try to do it yourself! See Exercise 2.

----

### Change environment variables

`oc set env dc/nodejs-example HELLO_MSG="Hello! I am an enviromentalist!"`

This will also trigger a new deployment.

----

### Use the web console to see your environment variable

### Use `oc rsh` to get a shell

`oc get pods -l app=nodejs-example`

`oc rsh nodejs-example-x-xxxxx`

`env`

---

## Exercise 4: Interacting with pods

### Create a PostgreSQL deployment

`oc new-app --template=postgresql-ephemeral -p POSTGRESQL_USER=sampledb -p POSTGRESQL_PASSWORD=samplepass`

----

### Open a **psql** shell

`oc get pods -l app=postgres-ephemeral`

`oc rsh postgresql-x-xxxxx`

`psql sampledb`

----

### Port forwarding to your local machine

`oc port-forward postgresql-x-xxxxx 5432:5432`

### Connect to your db using your favourite client

psql://localhost:5432

---

## Exercise 5: `oc new-app`

`oc new-app` is a command to create whole applications (is, bc, dc, svc, pvc, ...).
The behaviour depends on the input.

----

Possible inputs:

* Image `oc new-app registry.access.redhat.com/rhscl/httpd-24-rhel7`
* ImageStream `oc new-app -i static-site`
* ImageStreamTag `oc new-app -i static-site:prod`
* Template `oc new-app --template=postgres-ephemeral ...`
* Remote Git Repo `oc new-app https://github.com/tran-engineering/openshift-workshop-nodejs-example --name myapp`
* Local source files `oc new-app myapp`

---

## Exercise 6: Private git repository

Create a secret:
`oc create secret generic --type='kubernetes.io/basic-auth' --from-literal=username=kaynewest --from-literal=password=00000000 bitbucket`

----

Create bc+dc using `oc new-app`:
`oc new-app --source-secret=bitbucket httpd~https://bitbucket.balgroupit.com/scm/ows/static-site.git`

----

Create only bc using `oc new-build`:
`oc new-build httpd~https://bitbucket.balgroupit.com/scm/ows/static-site.git --source-secret=bitbucket --name=anothersite`

----

## Apply secrets automatically

`oc annotate secret bitbucket 'build.openshift.io/source-secret-match-uri-1=https://bitbucket.galgroupit.com/*'`
