import sys
import json
import pickle
import mnbLib

with open('model_pickle', 'rb') as f:
    model = pickle.load(f)

test = str(sys.stdin.readline())
test = [test]

predictions = mnbLib.make_predictions(model, test)
output = str(predictions[0])

json_str = json.dumps(output)
sys.stdout.write(json_str)
sys.stdout.flush()