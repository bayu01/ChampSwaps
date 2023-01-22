# ChampSwaps

ChampSwaps is a League of Legends plugin. It leverages [league-connect](https://www.npmjs.com/package/league-connect) NPM package to listen to League Client events during the Champion Select phase.
It provides a recommendation to the user what players should pick/trade based on simple algorithms explained below.

## Features
* The recommender supports two modes currently: `simple` and `mastery`. See sections below.
* The local agent populates your **system's Clipboard** with Champion Suggestions. (Riot is adamant on **not using**`lol-chat` to send messages within the League Client).

**Simple Mode**

Given the champions Ids picked( or available in Bench), find the most experienced Summoner for it. It could recommend the same Summoner on all champs if that's what Masteries say.
A Rather naive approach to recommendation.

**Mastery Mode**

Given some selected Champions (picked or in bench) and smaller number of summoners, It will prioritize a team of Summoners with No repetition of Champions and optimizing for a total Champion Mastery score in the team.

## Contents

`./local-agent-js/`
The local node agent that needs to run whenever the League client runs. Listens for LCU events.

`/local-agent-js/logs/`
Several log files are being used for debugging purposes. See `logger.mjs` for configuration.

`./terraform/`
Creation of AWS infrastructure

`./terraform/lambdas/summoner/`
NodeJS lambda triggered by API Gateway.

# Requirements

 * **AWS Account** -  Requires a Key Pair with enough credentials to administer API Gateway, Lambda, AIM roles. Store them under a `free-tier` AWS configure profile. Terraform is configured to read from them [here](terraform/providers.tf)
 * **NodeJS** - Requires a recent version of Node/NPM installed. (16.x or greater for the local agent). The Lambda portion of the app's runtime environment is v18.x.
 * **Terraform OSS** - Any Recent version of Terraform CLI. 
 * **RIOT_API_KEY** - Development Keys expire daily. However, you can be part of a Team or register your own app to obtain a Key that doesn't expire. It requires a valid Riot Account.

# Deployment

**Deployment of API Gateway Lambda Proxy**

1. From root `cd terraform`

    Create a file named `local.auto.tfvars` which include the following values. Do not commit this file since it contains sensitive information.
    
    ```hcl
    # These values don't change often.
    high_entropy_api_key= "" # include a high entropy password to be used to secure the public facing API Gateway endpoint. 30 chars minimum
    environment_name= "dev" # a short name to identify your local developmemt
    RIOT_API_KEY="RGAPI-###" # a RIOT GAMES API Key used for the lambda to hit RIOT endpoints
    recommender_mode= "mastery"
    riot_get_summoner_info_url= "https://###.api.riotgames.com/lol/summoner/v4/summoners/by-name/" # Fill with the Region to use https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName
    riot_get_summoner_masteries_url= "https://###.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" # Fill with the Region to use https://developer.riotgames.com/apis#champion-mastery-v4/GET_getAllChampionMasteries
    ```

2. `terraform init`
3. `terraform apply` and confirm changes.
4. The **public endpoint** will be printed in the output.
 

**Local NodeJs agent**

1. From root `cd local-agent-js`

    Create a file named `.env` with the following information. Do not commit this file since it contains sensitive information.

    ```.env
    # The deployed lambda endpoint. If you `terraform apply` and `destroy` frequently, this file needs to be updated.
    LAMBDA_ENDPOINT_URL=https://#########.amazonaws.com/dev/summoners
    # The acompanied key for the endpoint
    ENDPOINT_API_KEY=################################
    ```
   
2. `npm i`
3. `node .\index.js`

# Teardown

1. From the `/terraform` directory do a `terraform destroy` and confirm changes.
2. Stop the local running `/local-agent-js/` Node app.

Monitor your AWS account for Free Tier usage consumption. It should stay within the free-tier API gateway/Lambda invocation limit. Several optimizations were done on the Lambda code to allow for RIOT API response reuse.
You should also monitor your Cloudwatch storage or turn them off since they were mostly for development.

# Diagram

![Blank diagram - AWS (2019) horizontal framework](https://user-images.githubusercontent.com/6752227/222934732-68557c22-24bc-4dbc-a216-1ca571402429.png)

# Legal
ChampSwaps isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
