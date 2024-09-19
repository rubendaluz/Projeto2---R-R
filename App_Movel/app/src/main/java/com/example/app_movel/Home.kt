package com.example.app_movel

import android.annotation.SuppressLint
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.Toast
import androidx.core.app.ComponentActivity
import com.example.app_movel.api.Asset
import com.example.app_movel.api.AssetResponse
import com.example.app_movel.api.EndPoints
import com.example.app_movel.api.ServiceBuilder
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


@SuppressLint("RestrictedApi")
class Home : ComponentActivity() {
    private lateinit var assetNameEditText: EditText
    private lateinit var uhfTagEditText: EditText
    private lateinit var categorySpinner: Spinner
    private lateinit var roomSpinner: Spinner
    private lateinit var saveButton: Button


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)


        assetNameEditText = findViewById(R.id.assetName)
        uhfTagEditText = findViewById(R.id.uhfTag)
        categorySpinner = findViewById(R.id.categorySpinner)
        roomSpinner = findViewById(R.id.roomSpinner)
        saveButton = findViewById(R.id.saveButton)

        // Preencher os spinners com valores de exemplo
        val categories = arrayOf("Electronics", "Furniture", "Stationery")
        val rooms = arrayOf("Room A", "Room B", "Room C")

        val categoryAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, categories)
        categoryAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        categorySpinner.adapter = categoryAdapter

        val roomAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, rooms)
        roomAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        roomSpinner.adapter = roomAdapter

        saveButton.setOnClickListener {
            saveAsset()
        }

    }

    private fun saveAsset() {
        val assetName = assetNameEditText.text.toString()
        val uhfTag = uhfTagEditText.text.toString()
        val category = categorySpinner.selectedItem.toString()
        val room = roomSpinner.selectedItem.toString()

        val asset = Asset(assetName, uhfTag, "1", "1")

        val request = ServiceBuilder.buildService(EndPoints::class.java)
        val call = request.addAsset(asset)

        call.enqueue(object : Callback<AssetResponse> {
            override fun onResponse(call: Call<AssetResponse>, response: Response<AssetResponse>) {
                if (response.isSuccessful) {
                    val assetResponse = response.body()
                    Toast.makeText(this@Home, assetResponse?.message, Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@Home, "Erro ao adicionar o ativo", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<AssetResponse>, t: Throwable) {
                Toast.makeText(this@Home, "Erro de rede", Toast.LENGTH_SHORT).show()
            }
        })
    }
}