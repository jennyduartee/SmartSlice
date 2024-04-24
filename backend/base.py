from flask import Flask

api = Flask(__name__)

@api.route('/profile')

def my_profile():
    response_body = {
        "name": "SmarTSliceStation",
        "about" :"Sustainable way to track food intake!"
    }
    
    with open(r"/home/pi/average.txt", 'r') as file_handle: #READS THE WEIGHT OF THE FOOD
    #with open(r"#PATH FOR TEXT FILE CONTAINING WEIGHT ON PI 5", 'r') as file_handle:
        raw_data = file_handle.read().strip()  # Read the contents and remove leading/trailing whitespaces
        response_body['weight'] = float(raw_data) 
    
    with open(r"/home/pi/label_output.txt", 'r') as file_handle: #READS THE LABEL FOR FOOD
    #with open(r"#PATH FOR TEXT FILE CONTAINING LABEL ON PI 5", 'r') as file_handle:
        raw_data = file_handle.read().strip()  # Read the contents and remove leading/trailing whitespaces
        response_body['label'] = str(raw_data)   

    return response_body

