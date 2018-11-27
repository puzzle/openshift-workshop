# Openshift Workshop: Jenkins

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Setup Jenkins on Openshift

`oc new-app jenkins-ephemeral`

`oc new-app jenkins-persistent`

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

## One Jenkins vs Multiple Jenkins on Openshift

One:
* Easier to maintain
* Easier to deploy Jenkins specific libaries
* Uses less resources

Multiple:
* More power to developers
* Less clutter

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

https://github.com/openshift/origin/blob/master/examples/jenkins/pipeline/nodejs-sample-pipeline.yaml

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

---

## Openshift Jenkins Pipeline DSL

https://github.com/openshift/jenkins-plugin#jenkins-pipeline-formerly-workflow-plugin

----

## Commands

* openshiftBuild
* openshiftDeploy
* openshiftExec
* openshiftCreateResource
* openshiftDeleteResourceByJsonYaml
* openshiftDeleteResourceByLabels
* openshiftDeleteResourceByKey
* openshiftScale
* openshiftTag
* openshiftVerifyBuild
* openshiftVerifyDeployment
* openshiftVerifyService
* openshiftImageStream
