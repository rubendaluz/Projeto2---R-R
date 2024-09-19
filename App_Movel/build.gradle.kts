buildscript {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
    dependencies {
        classpath(libs.gradle)
        // Outras dependências do classpath, se houver
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}


// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.5.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.0" apply false
}
