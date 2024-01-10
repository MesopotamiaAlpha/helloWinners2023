import RPi.GPIO as GPIO
import time
import vlc
import os

# Configuração dos pinos do HC-SR04
print("Iniciando pinos 23 para trigger e 27 para echo")
TRIGGER_PIN = 23
ECHO_PIN = 27

# Configuração do modo BCM para os pinos
GPIO.setmode(GPIO.BCM)

# Configuração dos pinos como saída e entrada
GPIO.setup(TRIGGER_PIN, GPIO.OUT)
GPIO.setup(ECHO_PIN, GPIO.IN)

# Inicializa o player do VLC
print("Inicializando VLC")
instance = vlc.Instance("--no-xlib --aout=hdmi")  # Define a saída de áudio para ALSA
player = instance.media_player_new()
media = instance.media_new("/Videos/videoCompleto.mp4")
player.set_media(media)

# Define a tela cheia (fullscreen)
player.set_fullscreen(True)
player.pause()  # Pausa o vídeo no início

# Lista de valores para controlar o tempo de reprodução (em segundos)
play_durations = [12, 69, 102, 141, 187, 227, 260, 281, 294, 346, 382, 392, 406, 429,450,481,520,565,607,640,662,674,726,766,775,789,813,834,864,902,948,989,1024,1045,1058,1110,1148,1158,1172,1195,1216,1246,1286,1331,1373,1405,1427,1440,1490,1530,1540,1554,1577,1598,1629,1669,1714 ]
current_play_duration = 0  # Variável para acompanhar o índice atual
current_time = 0

# Valor para interromper o vídeo
stop_video_time = 9999410.35

def play_video():
    try:
        player.play()
        player.set_fullscreen(True)  # Certifique-se de definir a tela cheia ao reiniciar
        print("Pessoa Identificada, reproduzindo vídeo")
        global current_time
        time_to_play = play_durations[current_play_duration]
        while current_time < time_to_play:
            state = player.get_state()
            if state == vlc.State.Ended:
                player.set_media(media)  # Reinicia o vídeo do início
#                reiniciar_linux()
            current_time = player.get_time() / 1000  # Converter para segundos
            print(f"Tempo atual: {current_time:.2f} segundos, Estado: {state}")
            if current_time >= stop_video_time:
                player.stop()
                break
            time.sleep(1)
            current_time += 1
        player.pause()
        current_time = 0
    except Exception as e:
        print(f"Erro ao reproduzir o vídeo: {e}")
        reiniciar_linux()  # Reinicie o Linux em caso de erro

def medir_distancia():
    try:
        # Limpa o pino de trigger
        GPIO.output(TRIGGER_PIN, False)
        time.sleep(0.5)

        # Gera um pulso de 10 microssegundos no pino de trigger
        GPIO.output(TRIGGER_PIN, True)
        time.sleep(0.00001)
        GPIO.output(TRIGGER_PIN, False)

        # Registra o tempo de início
        while GPIO.input(ECHO_PIN) == 0:
            pulse_start = time.time()

        # Registra o tempo de fim
        while GPIO.input(ECHO_PIN) == 1:
            pulse_end = time.time()

        # Calcula a duração do pulso ultrassônico
        pulse_duration = pulse_end - pulse_start

        # Calcula a distância em centímetros
        distance = pulse_duration * 17150

        return distance
    except Exception as e:
        print(f"Erro ao medir a distância: {e}")
        return None

def reiniciar_linux():
    try:
        os.system("sudo reboot")
    except Exception as e:
        print(f"Erro ao reiniciar o Linux: {e}")
# Carrega o vídeo e deixa pausado na tela inicial
play_video()

try:
    while True:
        distancia = medir_distancia()

        if distancia is not None:
            # Se a distância for menor que 50 cm, reproduza o vídeo com base no tempo definido
            if distancia < 50:
                play_video()

                # Atualize o índice do tempo de reprodução, evitando um índice fora dos limites
                current_play_duration = (current_play_duration + 1) % len(play_durations)

        time.sleep(0.1)  # Espere 0.1 segundo antes da próxima medição

except KeyboardInterrupt:
    # Encerre o script quando o usuário pressionar Ctrl+C
    pass

except Exception as e:
    print(f"Erro inesperado: {e}")
    reiniciar_linux()  # Reinicie o Linux em caso de erro

finally:
    player.release()
    # Limpa a configuração dos pinos GPIO
    GPIO.cleanup()
