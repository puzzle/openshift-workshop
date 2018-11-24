# Openshift Workshop: Jenkins

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Setup Jenkins on Openshift

`oc new-app jenkins-ephemeral`

`oc new-app jenkins-persistent`

Setups a Jenkins with Openshift Authentication (using OAuth2)

---

## Jenkins

* Role: **admin** can Administrate Jenkins
* Role: **edit** can create/edit Jenkins jobs, run builds
* Role: **view** can only view

---

## One Jenkins vs Multiple Jenkins on Openshift

One:
* Easier to maintain
* Easier to deploy Jenkins specific libaries

Multiple:
* More freedom for developers
* Less clutter

---

## Scripted Pipeline

```groovy
node {
    stage('Print something') {
        if (env.BRANCH_NAME == 'master') {
            echo 'I only execute on the master branch'
        } else {
            echo 'I execute elsewhere'
        }
    }
}
```

---

## Declarative Pipeline

```groovy
pipeline {
    agent any
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

---

## Openshift Plugin for Pipeline Scripts

https://github.com/openshift/origin/blob/master/examples/jenkins/pipeline/nodejs-sample-pipeline.yaml

```groovy
pipeline {
    agent any
    stages {
        script {
            openshift.withCluster() {
                openshift.withProject() {
                    echo "Using project: ${openshift.project()}"
                }
            }
        }
    }
}
```

---

