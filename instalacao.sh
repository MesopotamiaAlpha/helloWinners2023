#!/bin/bash
echo updating repository
sudo apt update

echo instalando os programas
sudo apt-get --assume-yes install screen python3
sudo apt-get --assume-yes install samba samba-common smbclient
sudo apt-get --assume-yes install pigpio
sudo apt-get --assume-yes install vlc python-vlc
sudo systemctl start pigpiod
sudo systemctl enable pigpiod

echo "Criando usuario smb"
yes userwinner | adduser --gecos "" userwinner

echo
echo "criando a configuração do smb"
echo "[global]
workgroup = USERWINNER"$((1 + $RANDOM % 10000)) > /etc/samba/smb.conf
echo "security = user
encrypt passwords = yes
client min protocol = SMB2
client max protocol = SMB3

[PastaWinner]
comment = userwinner-Videos
path = /Videos
read only = no

" >> /etc/samba/smb.conf


echo
echo "Criando a senha de usuario userwinner"
yes userwinner | smbpasswd -a userwinner


echo
echo "Reiniciando smb"
sudo service smbd restart
sudo service nmbd restart

echo "Criando diretórios"
mkdir /Videos
mkdir /opt/userwinner
mkdir /opt/userwinner/bin
mkdir /opt/userwinner/Playlists
mkdir /opt/userwinner/Options
mkdir /opt/userwinner/Trigger
mkdir /opt/userwinner/Playlists/Default
echo "Jack" > /opt/userwinner/Options/sound
echo "Loop" > /opt/userwinner/Options/playmode
echo "Default" > /opt/userwinner/Options/playlist

chown -R userwinner:www-data /opt/userwinner
chmod -R 770 /opt/userwinner


echo escondendo os icones do raspyberry
sudo sed -i "1 s|$| logo.nologo quiet|" /boot/cmdline.txt

#echo hide boot messages
#sudo sed -i "1 s|$| quiet splash|" /boot/cmdline.txt

echo desabilitando prompt de login
sudo systemctl disable getty@tty1.service

echo escondendo o cursor
sudo sed -i "1 s|$| vt.global_cursor_default=0|" /boot/cmdline.txt

echo escondendo mensagem de undervoltage
sudo sed -i "1 s|$| loglevel=1|" /boot/cmdline.txt

echo escondendo mensagem de undervoltage lightning bolt icone
sudo echo "" >> /boot/config.txt
sudo echo "avoid_warnings=1" >> /boot/config.txt

echo escondendo splash screen
sudo echo "" >> /boot/config.txt
sudo echo "disable_splash=1" >> /boot/config.txt

echo movendo mensagens para o tty3
sudo sed -i 's/console=tty1/console=tty3/g' /boot/cmdline.txt

echo escondendo splash screen
sudo echo "" >> /boot/config.txt
sudo echo "gpu_mem=256" >> /boot/config.txt

echo "escondendo login"
sudo systemctl disable getty@tty1.service

cp -rvf files/bin/* /opt/userwinner/bin/
chmod +x /opt/userwinner/bin/*

chown -R userwinner:www-data /opt/userwinner
chmod -R 770 /opt/userwinner

echo
echo "Mudando as permissões do diretorio de video"
chown -R userwinner:www-data /Videos


echo adicionando script de autostart autostart

sed -i '$ d' /etc/rc.local
echo "python /opt/userwinner/bin/teste.py  &" >> /etc/rc.local
echo "exit 0" >> /etc/rc.local
echo
echo
echo "Reiniciando em 60 segundos"
sleep 60
reboot