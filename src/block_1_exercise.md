# Openshift Workshop: Exercise Block

<small>04.10.2018 - tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Prerequesities

### Install the Openshift Client (oc)

https://OPENSHIFT-NODE/console/command-line

### Best practices

* Put it in your PATH
* Have a working git binary (proxy settings!)
* Bash completion: `sudo sh -c "oc completion bash > /etc/bash_completion.d/oc"`

---

## Useful basic commands (for developers)

`oc login [URL]`
`oc status`
`oc whoami`

---

## Exercise 1: Create/Select your project

`oc login`

`oc new-project USERNAME-sandbox` (only if you have rights)

`oc project USERNAME-sandbox`

---

## Exercise 2: Create a source build + binary deployment

### Create a new build

`oc new-build --binary httpd --name static-site`

----

### Create a simple static html directory

`mkdir static-site`

`echo hello world > static-site/index.html`

### Build an image from source

`oc start-build static-site --from-dir=static-site --follow`

----

### Check what Openshift has generated

`oc get all -l build=static-site`

### Create a deployment config

`oc new-app --image-stream=static-site`

### Create a route

`oc create route edge static-site --service=static-site`

----

### Show the generated URL

`oc get route/static-site`

### Use your browser to check the URL

Something among the lines:

https://static-site-kt-sandbox.OPENSHIFT-NODE/

---

## Exercise 3: Create a Dockerfile build + binary deployment

### Create a Dockerfile

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
  res.end(process.env.HELLO_MSG || 'Hello! Please try to set the environment variable: HELLO_MSG!')
}).listen(8080)
console.log('Server listening on :8080')
```

----

### Create a build

`oc new-build . --name nodejs-example`

`oc start-build nodejs-example --from-dir=. --follow`

----

### Create a `DeploymentConfig`

Try to do it yourself! See Exercise 2.

### Check your browser

Try to do it yourself! See Exercise 2.

----

### Change environment variables

`oc env dc/nodejs-example HELLO_MSG="Hello! I am an enviromentalist!"`

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

### Open a `psql` shell

`oc get pods -l app=postgres-ephemeral`

`oc rsh postgresql-x-xxxxx`

`psql sampledb`

----

### Port forwarding to your local machine

`oc port-forward postgresql-x-xxxxx 5432:5432`

### Connect to your db using your favourite client

psql://localhost:5432