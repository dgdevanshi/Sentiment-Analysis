import sys
import json
import pickle
import mnbLib
import knnLib

with open('mnb_model_pickle', 'rb') as f:
    mnb = pickle.load(f)

with open("knn_model_pickle", "rb") as f:
    knn = pickle.load(f)

test = str(sys.stdin.readline())
test = [test]

predictions_mnb = mnbLib.make_predictions_mnb(mnb, test)

predictions_knn = knnLib.make_predictions_knn(knn, test)

output = {"mnb": str(predictions_mnb[0]), "knn": str(predictions_knn[0])}

json_str = json.dumps(output)
sys.stdout.write(json_str)
sys.stdout.flush()