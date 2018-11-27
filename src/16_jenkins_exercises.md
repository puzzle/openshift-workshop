# Openshift Workshop: Openshift JBoss EAP using S2I

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Exercise 1: Setup your Jenkins

`oc new-app jenkins-ephemeral`

---

## Exercise 2: Freestyle project: Openshift Create

1. Login to your jenkins using your Openshift Credentials.
2. Create a freestyle project called *freestyle-create*
3. Add a build step *"Create OpenShift resource(s)"*
4. Insert into the *json/yaml field* the output of `oc new-app httpd -o yaml`
5. Build your *freestyle-create* project
6. Check the console output of your build

---

## Exercise 3: Freestyle project: Openshift Delete

1. Create a freestyle project called *freestyle-delete*
2. Create a build *"Delete Openshift resources by key"* step that deletes your `ImageStream` (is/static-site)
3. Create an additional build step *"Delete Openshift resources by label"* that deletes all objects with label app=static-site
4. Build your *freestyle-delete* project
5. Check the console output of your build

---

## Exercise 4: Hello World pipeline project

1. Create a pipeline project called *pipeline-create*
2. Insert script below:

```groovy
pipeline {
  agent {
    node {
      label 'maven' 
    }
  }
  options {
    timeout(time: 10, unit: 'MINUTES') 
  }
  stages {
    stage('hello') {
        steps {
            script {
                openshift.withCluster() {
                    openshift.withProject() {
                        echo "Hello from project: ${openshift.project()}"
                    }
                }
            }
        }
    }
  }
}
```
---

## Exercise 5: Pipeline Create

In your previous pipeline script,
add a new stage *cleanup*:

```groovy
stage('cleanup') {
    steps {
        script {
            openshift.withCluster() {
                openshift.withProject() {
                    openshift.selector("all", [ template : 'httpd-example' ]).delete()
                }
            }
        }
    }
}
```
----

Add a new stage *create*:

```groovy
stage('create') {
    steps {
        script {
            openshift.withCluster() {
                openshift.withProject() {
                    openshift.newApp('httpd-example') 
                }
            }
        }
    }
}
```

---

## Exercise 6: Leverage Openshift Builds with --strategy=pipeline

```
git branch: 'master',
    credentialsId: 'bitbucket',
    url: 'https://'
```

---