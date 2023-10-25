 gcloud functions deploy update-gigs \
  --gen2 \
  --region=europe-north1 \
  --runtime=nodejs16 \
  --source=. \
  --entry-point=updateGigs \
  --trigger-http

