{
    "options": {
        "open_tracking": false,
            "click_tracking": false
    },
    "campaign_id": "oldthorns",
    "content": {
        "template_id": "regsuccess"
    },
    "substitution_data": {
        "event": "Old Thorns"
    },
    "recipients": [
        {
            "address": {
                "email": user.email,
                "name": user.fname + " " + user.lname
            },
            "substitution_data": {
                "first_name": user.fname,
                "last_name": user.lname
            }
        }
    ]
}
