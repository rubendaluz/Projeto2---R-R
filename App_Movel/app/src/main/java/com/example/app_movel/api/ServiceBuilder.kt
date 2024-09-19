package com.example.app_movel.api

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ServiceBuilder {
//    private const val URL = "http://192.168.1.209:4242/api/"
    private const val URL = "http://192.168.110.94:4242/api/"
    private val client = OkHttpClient.Builder().build()
    private val retrofit = Retrofit.Builder().baseUrl(URL).addConverterFactory(GsonConverterFactory.create()).client(client)
        .build()
    fun<T> buildService(service: Class<T>): T{
        return retrofit.create(service) }
}
