### Blockchain.js

* **newBlock** (proof, previousHash) => block
  Generate a new block given the already calculated proof and the previous Hash and returns the obtained block
* **newTransaction** (sender, receiver, amount) => transaction
  Generate a new transaction and adds it to the currentTransactions array which will be added in the next new block
* **mine** (miner) => block
  Mines a new block, assigns it to the miner and generate the associated block

### Network.js

* **registerNode** (address) => boolean
  Enable the insertion of new nodes and returns if the address has been added (cannot add twice the same address)
* **nodeExists** (address) => boolean
  Fetches in the nodes array if the provided node already exists and returns this information


### Analyse Critique du Proof of Work
1. Problèmes de l'implémentation actuelle

L’implémentation du Proof of Work présente plusieurs vulnérabilités  :

    Absence de calcul cryptographique sécurisé :
        Le Proof of Work est basé sur une simple opération mathématique entre l’adresse du sender et du receiver (generateIntegerFromAddress).

    Faible coût computationnel :
        Le calcul de la preuve est instantané : il suffit de multiplier une valeur entière par l’amount.
        Un vrai Proof of Work impose une complexité algorithmique avec des millions d’essais avant de trouver une solution valide.

    Facilité de manipulation :
        Un attaquant peut générer des transactions avec des valeurs arbitraires pour manipuler la preuve.
        Par exemple, un utilisateur malveillant pourrait créer une adresse spécifique pour que generateIntegerFromAddress(address) génère un nombre prédéfini optimisé pour réduire le travail.

    Problème avec calculateHash :
        La fonction calculateHash repose sur une concaténation avec un timestamp (new Date().getTime().toString(16)).
        Ce n’est pas une vraie fonction de hash cryptographique (comme SHA-256), ce qui signifie que les collisions sont possibles.

2. Risques de Sécurité

Les conséquences de ces faiblesses sont critiques :

    Aucune protection contre les attaques de préimage :
        Un vrai Proof of Work doit rendre difficile la prédiction du hash. Ici, un attaquant peut facilement prédire et manipuler les valeurs de generateProof.

    Vulnérabilité aux attaques Sybil :
        Puisque la difficulté est très faible, un attaquant peut générer un grand nombre de transactions et miner très rapidement, rendant la blockchain inefficace.

    Risque d’attaque par falsification de transactions :
        Un utilisateur peut manipuler ses transactions en utilisant des adresses spécifiques pour obtenir un Proof of Work avantageux.