package com.example.app_movel.api

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface EndPoints {

    @Headers("Content-Type: application/json")
    @POST("user/login")
    fun loginUser(@Body loginRequest: LoginRequest): Call<LoginResponse>

    @POST("objects/create")
    fun addAsset(@Body asset: Asset): Call<AssetResponse>
}