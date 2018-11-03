# Alexa Diffen games
Alexa skill to get info for DIF games

## Stack
Lambdan är deployad med serverless och ingår inte i alexa ask konfigurationen. 

## Prodsättning
Deploya lambdan om ändringar är gjorda i den
```
nr sls-deploy
```

Är det ändringar på modellen etc, deploya dom bitarna 
```
ask deploy
```