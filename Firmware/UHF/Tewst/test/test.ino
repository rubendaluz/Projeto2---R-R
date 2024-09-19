#include <M5Atom.h>
#include "RFID_command.h"

UHF_RFID RFID;

String comd = " ";
CardpropertiesInfo card;
ManyInfo cards;
SelectInfo Select;
CardInformationInfo Cardinformation;
QueryInfo Query;
ReadInfo Read;
TestInfo Test;

void setup() {
    M5.begin();

    RFID._debug = 0;
    Serial2.begin(115200, SERIAL_8N1, 32, 26);
    if (RFID._debug == 1) Serial.begin(115200, SERIAL_8N1, 21, 22);

    // UHF_RFID set
    RFID.Set_transmission_Power(2600);
    RFID.Set_the_Select_mode();
    RFID.Delay(100);
    RFID.Readcallback();
    RFID.clean_data();

    // Prompt to connect UHF_RFID
    Serial.println("Please connect UHF_RFID to Port C");

    // Check connection to UHF_RFID
    String soft_version;
    soft_version = RFID.Query_software_version();
    while (soft_version.indexOf("V2.3.5") == -1) {
        RFID.clean_data();
        RFID.Delay(300); // Combining two delays into one
        soft_version = RFID.Query_software_version();
    }

    // Prompt to approach RFID card
    Serial.println("Please approach the RFID card you need to use");
}

void loop() {
    // Query card information once
    card = RFID.A_single_poll_of_instructions();
    if (card._ERROR.length() != 0) {
        Serial.println(card._ERROR);
    } else {
        if (card._EPC.length() == 24) {
            Serial.println("RSSI :" + card._RSSI);
            Serial.println("PC :" + card._PC);
            Serial.println("EPC :" + card._EPC);
            Serial.println("CRC :" + card._CRC);
            Serial.println(" ");
        }
    }
    RFID.clean_data();  // Empty the data after using it

    /* Uncomment to read multiple RFID cards at once
    cards = RFID.Multiple_polling_instructions(6);
    for (size_t i = 0; i < cards.len; i++) {
        if (cards.card[i]._EPC.length() == 24) {
            Serial.println("RSSI :" + cards.card[i]._RSSI);
            Serial.println("PC :" + cards.card[i]._PC);
            Serial.println("EPC :" + cards.card[i]._EPC);
            Serial.println("CRC :" + cards.card[i]._CRC);
        }
    }
    Serial.println(" ");
    RFID.clean_data();
    */

    /* Uncomment to get the SELECT parameter
    Select = RFID.Get_the_select_parameter();
    if (Select.Mask.length() != 0) {
        Serial.println("Mask :" + Select.Mask);
        Serial.println("SelParam :" + Select.SelParam);
        Serial.println("Ptr :" + Select.Ptr);
        Serial.println("MaskLen :" + Select.MaskLen);
        Serial.println("Truncate :" + Select.Truncate);
        Serial.println(" ");
    }
    RFID.clean_data();
    */

    /* Uncomment to change the PSF bit of the NXP G2X label
    Cardinformation = RFID.NXP_Change_EAS(0x00000000);
    if (Cardinformation._UL.length() != 0) {
        Serial.println("UL :" + Cardinformation._UL);
        Serial.println("PC :" + Cardinformation._PC);
        Serial.println("EPC :" + Cardinformation._EPC);
        Serial.println("Parameter :" + Cardinformation._Parameter);
        Serial.println("ErrorCode :" + Cardinformation._ErrorCode);
        Serial.println("Error :" + Cardinformation._Error);
        Serial.println("Data :" + Cardinformation._Data);
        Serial.println("Successful :" + Cardinformation._Successful);
        Serial.println(" ");
    }
    RFID.clean_data();
    */

    /* Uncomment to get the Query parameters
    Query = RFID.Get_the_Query_parameter();
    if (Query.QueryParameter.length() != 0) {
        Serial.println("QueryParameter :" + Query.QueryParameter);
        Serial.println("DR :" + Query.DR);
        Serial.println("M :" + Query.M);
        Serial.println("TRext :" + Query.TRext);
        Serial.println("Sel :" + Query.Sel);
        Serial.println("Session :" + Query.Session);
        Serial.println("Targetta :" + Query.Target);
        Serial.println("Q :" + Query.Q);
        Serial.println(" ");
    }
    RFID.clean_data();
    */

    /* Uncomment to read receive demodulator parameters
    Read = RFID.Read_receive_demodulator_parameters();
    if (Read.Mixer_G.length() != 0) {
        Serial.println("Mixer_G :" + Read.Mixer_G);
        Serial.println("IF_G :" + Read.IF_G);
        Serial.println("Thrd :" + Read.Thrd);
        Serial.println(" ");
    }
    RFID.clean_data();
    */
}
