# Openshift Workshop: JBoss EAP S2I Exercises

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Goals

* Learn to deploy JBoss applications using Openshift S2I JBoss build.
* Learn to setup liveliness and readiness probes.
* Learn how to use autoscaling

---

## Exercise 1: Gather the artifacts

Clone pre-built artifacts from 

`git clone ssh://git@bitbucket.balgroupit.com/ows/sample-deployments.git`

or

`git clone https://bitbucket.balgroupit.com/scm/ows/sample-deployments.git`

*in a real world situation, you should get these artifacts from Nexus / Artifactory.

---

## Exercise 2: Prepare your S2I source

Create a directory:

`mkdir jboss-app`

Copy `sample.war` and `openshift-tasks.war` in *deployments* directory.

----

Rename `openshift-tasks.war` to `ROOT.war`

In order to make *openshift-tasks.war* display at the `/`

---

## Exercise 3: Create an Openshift build

`oc new-build registry.access.redhat.com/jboss-eap-7/eap71-openshift --name jboss-app --binary`

---

## Exercise 4: Trigger a new build

Make sure you are in the *jboss-app* directory.

`oc start-build jboss-app --from-dir=. --follow`

---

## Exercise 5: Create a new DeploymentConfig

`oc new-app jboss-app`

---

## Exercise 6: Create a Route

Try to use either WebConsole or *oc*

Hint: Please create an *unsecured route*, since the deployment *openshift_tasks.jar* doesn't support https.

---

## Exercise 7: Check your deployments

Point your browser to the `/` and to the `/sample` deployment to check if they have been correctly deployed.

---

## Exercise 8: Add a readiness probe

Add a readiness probe using the web console:

* Type: **HTTP GET**
* Path: **/ws/demo/healthcheck**
* Port: **8080**
* Initial Delay: **60**
* Timeout: **5**

---

## Exercise 9: Add liveliness probe

Add a liveliness probe using **oc** client:

`oc set probe dc/jboss-app --help`

Try to figure out the parameters yourself!

Hint: Use the same probe as the readiness probe.

Note: 

`oc set probe dc/jboss-app --readiness --initial-delay-seconds=60 --timeout-seconds=5 --get-url=http://:8080/ws/demo/healthcheck`

---

## Exercise 10: Set resource limits

`oc set resources dc/jboss-app --help`

Try to figure out the parameters yourself!

Hint: Safe values for this deployment: `cpu=200m,memory=1024Mi`

(optional) Try to set resource limits on the web console.

Note:

`oc set resources dc/jboss-app --limits=cpu=200m,memory=1024Mi`

---

## Exercise 11: Play around

Try out various buttons from the *openshift_tasks.war* deployment.

Look in the logs of the deployment.

* Use the log buttons
* Kill the Pod

---

## Exercise 12: Add a autoscaler

Set an autoscaler using *oc* client:

`oc autoscale dc/jboss-app --help`

Try to set it using web console too!

Hint: recommended for this exercise:
* Min: 1
* Max: 5
* Target average cpu utilization: 50

---

## Exercise 13: Play around with autoscaling

* Generate some load using *openshift_tasks* deployment
* Look at the web console to see if your application is scaling!
