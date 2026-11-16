#!/bin/bash
# Aggiorna Spiderweb dal fork wifi75/spiderweb, riavvia e controlla il portale.
# Se il portale non torna attivo, ripristina da solo la versione precedente.
# Uso: sudo ~/aggiorna-spiderweb.sh

DIR=/home/sysop/spiderweb
BRANCH=master

if [ "$(id -u)" -ne 0 ]; then
	echo "Serve sudo:  sudo $0"
	exit 1
fi

cd "$DIR" || { echo "Cartella $DIR non trovata"; exit 1; }

OLD=$(git rev-parse HEAD)
echo "Versione attuale : $(git log -1 --format='%h %s')"

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
	echo
	echo "ATTENZIONE: ci sono file modificati a mano sul server:"
	git status --short --untracked-files=no
	echo "Aggiornamento annullato, per non perdere le modifiche."
	exit 1
fi

git fetch -q origin || { echo "Impossibile contattare GitHub"; exit 1; }
NEW=$(git rev-parse "origin/$BRANCH")

if [ "$OLD" = "$NEW" ]; then
	echo "Gia aggiornato: niente da fare."
	exit 0
fi

echo
echo "Novita da installare:"
git log --oneline "$OLD..$NEW"
echo

git pull -q --ff-only origin "$BRANCH" || { echo "Aggiornamento non riuscito (git pull)"; exit 1; }

echo "File cambiati:"
git -c color.ui=always diff --stat "$OLD" HEAD
echo

echo "Riavvio di spiderweb..."
systemctl restart spiderweb
sleep 6

OK=0
for i in 1 2 3 4 5 6; do
	CODE=$(curl -s -m 5 -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/)
	if [ "$CODE" = "200" ]; then
		OK=1
		break
	fi
	sleep 3
done

if systemctl is-active --quiet spiderweb && [ "$OK" = "1" ]; then
	echo
	echo "FATTO: portale attivo (HTTP 200)"
	echo "Versione installata: $(git log -1 --format='%h %s')"
	echo "Ricarica la pagina con Ctrl+F5."
else
	echo
	echo "ERRORE: il portale non risponde. Ripristino la versione precedente..."
	git reset -q --hard "$OLD"
	systemctl restart spiderweb
	sleep 6
	echo "Ripristinata la versione $(git log -1 --format='%h %s'): servizio $(systemctl is-active spiderweb)"
	exit 1
fi
