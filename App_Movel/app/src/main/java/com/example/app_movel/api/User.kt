package com.example.app_movel.api

data class User(
    val id: Int,
    val firstName: String,
    val lastName: String,
    val nfcTag: String,
    val email: String,
    val phone: Int,
    val accessLevel: Int
)