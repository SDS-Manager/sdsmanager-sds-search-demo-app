#! /bin/bash
docker login --username netpowerasdockerhub --password dckr_pat_mhVvWAV8q0SKeGrnIc98K84BCgI
echo "Please enter your tag version such as v1.x.x or latest"
read SDS_ADMIN_TAG
export SDS_ADMIN_TAG=$SDS_ADMIN_TAG
git checkout main
git pull
cd frontend
docker build -t netpowerasdockerhub/sds:sds_demo_fe.main.$SDS_ADMIN_TAG -f Dockerfile .	
docker image push netpowerasdockerhub/sds:sds_demo_fe.main.$SDS_ADMIN_TAG
cd ..
cd backend
docker build -t netpowerasdockerhub/sds:sds_demo_be.main.$SDS_ADMIN_TAG -f Dockerfile .
docker image push netpowerasdockerhub/sds:sds_demo_be.main.$SDS_ADMIN_TAG
cd ..
echo "Remove images is not using in last 72 hours...."
docker image prune -f -a --filter "until=72h"
echo "Old images removed"
