import random


def roll_die(sides: int) -> int:
    return random.randint(1, sides)


def attack(attacker_name: str, target_name: str, attack_bonus: int, target_ac: int, damage_die: int, damage_bonus: int) -> int:
    d20 = roll_die(20)
    total_attack = d20 + attack_bonus
    print(f"{attacker_name} attacks {target_name}: d20({d20}) + {attack_bonus} = {total_attack} vs AC {target_ac}")

    if d20 == 20:
        damage = roll_die(damage_die) + damage_bonus
        crit_bonus = roll_die(damage_die)
        total_damage = damage + crit_bonus
        print(f"Critical hit! Damage: {damage} + crit die {crit_bonus} = {total_damage}")
        return total_damage

    if total_attack >= target_ac:
        total_damage = roll_die(damage_die) + damage_bonus
        print(f"Hit! Damage roll: d{damage_die} + {damage_bonus} = {total_damage}")
        return total_damage

    print("Miss!")
    return 0


def run_combat() -> None:
    print("=== Simple Combat Mode (SRD-style) ===")

    player_hp = 20
    player_ac = 15
    player_attack_bonus = 5
    player_damage_die = 8
    player_damage_bonus = 3

    enemy_hp = 12
    enemy_ac = 13
    enemy_attack_bonus = 4
    enemy_damage_die = 6
    enemy_damage_bonus = 2

    print(f"Player: HP {player_hp}, AC {player_ac}")
    print(f"Enemy: HP {enemy_hp}, AC {enemy_ac}")
    print("One enemy only. Quick fight up to 5 rounds.\n")

    for round_num in range(1, 6):
        print(f"-- Round {round_num} --")

        enemy_hp -= attack("Player", "Enemy", player_attack_bonus, enemy_ac, player_damage_die, player_damage_bonus)
        enemy_hp = max(0, enemy_hp)
        print(f"Enemy HP: {enemy_hp}")
        if enemy_hp == 0:
            print("You win!")
            return

        player_hp -= attack("Enemy", "Player", enemy_attack_bonus, player_ac, enemy_damage_die, enemy_damage_bonus)
        player_hp = max(0, player_hp)
        print(f"Player HP: {player_hp}\n")
        if player_hp == 0:
            print("You were defeated.")
            return

    print("Combat ends quickly as planned. Both sides disengage.")


if __name__ == "__main__":
    run_combat()
