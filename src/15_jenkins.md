# Openshift Workshop: Jenkins CI/CD with Openshift

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Setup Jenkins on Openshift

`oc new-app jenkins-ephemeral`

Setups a Jenkins with Openshift Authentication (using OAuth2)

---

## Using Openshift shipped Jenkins

* Authentication using Openshift OAUTH2
* Preconfigured Openshift Plugin and Access Tokens for Openshift
* Predefined Kubernetes plugin: *maven* and *nodejs* (see Manage Jenkins --> Configure System --> Kubernetes Pod Templates) with autoscaling
* Jenkins SCM for ImageStreams

---

## OAUTH2 with Openshift

* Openshift Role: **admin** can Administrate Jenkins
* Openshift Role: **edit** can create/edit Jenkins jobs, run builds
* Openshift Role: **view** can only view builds

---

## Jenkins and Openshift: Endless possibilities

* Freestyle Projects
* Pipeline Projects
* Multibranch Pipeline Projects

* Openshift ImageStream as SCM (trigger jobs)

----

## Pipeline Views in Openshift

* Provide pipeline script directly in BuildConfig
* Pipeline scripts from GIT repostory

---

## Declarative Pipeline Syntax

```groovy
pipeline {
    agent {
        node 'maven'
    }
    stages {
        stage('Print something') {
            steps {
                if (env.BRANCH_NAME == 'master') {
                    echo 'I only execute on the master branch'
                } else {
                    echo 'I execute elsewhere'
                }
            }
        }
    }
}
```

https://jenkins.io/doc/book/pipeline/syntax/

---

## Openshift Plugin for Pipeline Scripts

```groovy
pipeline {
    agent {
        node 'nodejs'
    }
    stages {
        stage('hello') {
            script {
                openshift.withCluster() {
                    openshift.withProject() {
                        echo "Using project: ${openshift.project()}"
                    }
                }
            }
        }
    }
}
```

https://github.com/openshift/jenkins-client-plugin

---

## Useful: Pipeline Snippet Generator

---

## Notable commands

### openshift.verbose()

Turns on details about Openshift Interactions

*openshift.verbose(false)* turns it off

----

### Process templates

```groovy
def models = openshift.process("openshift//httpd-example", '-p', 'HELLO_MSG=hello')
openshift.create(models)
```

----

### openshift.newApp()

```groovy
openshift.newApp('httpd-example')
```

----

## narrow() on selections

```groovy
def all = openshift.newApp('httpd-example')
def bc = all.narrow('bc')
bc.metadata.labels['somelabel'] = 'foo'
openshift.apply(bc)
```

----

## selections

```groovy
def all = openshift.selector('all', [app: 'jboss-app'])
if (all.exists()) {
    all.delete()
}
```

---

## openshift.raw()

The plugin doesn't support everything.
But you can still do unsupported actions with *openshift.raw()* or `sh 'oc ...'`

```groovy
// The following is equivalent
openshift.raw('get all --all')
sh 'oc get all --all'
```
