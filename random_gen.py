import random
import sys
import os
import time
import msvcrt  # Windows-specific for single keypress detection

# Terminal Styling
RESET = "\033[0m"
BOLD = "\033[1m"
CYAN = "\033[36m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
MAGENTA = "\033[35m"

def clear_screen():
    """Clears the terminal screen for a clean UI experience."""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    """Prints a stylish header using standard ASCII for compatibility."""
    print(f"{CYAN}{BOLD}+------------------------------------------+")
    print("|         random number generator          |")
    print(f"+------------------------------------------+{RESET}")

def get_limit():
    """Prompts the user for a hard limit with validation."""
    while True:
        try:
            print(f"\n{YELLOW} {BOLD}?{RESET} Please enter a hard limit (Max value): ", end="", flush=True)
            # We still use input() for the limit since it's a multi-character number
            val = input().strip()
            
            if val.lower() in ['exit', 'quit', 'q']:
                print(f"\n{MAGENTA}i love sleep deprivation!{RESET}")
                sys.exit(0)
                
            limit = int(val)
            if limit < 1:
                print(f"{RED}  ! Error: Limit must be a positive integer.{RESET}")
                continue
            return limit
        except ValueError:
            if val:
                print(f"{RED}  ! Error: '{val}' is not a valid number.{RESET}")
            else:
                print(f"{RED}  ! Error: Please enter a number.{RESET}")

def get_mode():
    """Initial selection for the generation mode using single keypress."""
    print(f"\n{BOLD}Select Generation Mode:{RESET}")
    print(f"  [{YELLOW}1{RESET}] True Random (Numbers can repeat)")
    print(f"  [{YELLOW}2{RESET}] No Repeats (Unique until all used)")
    print(f"\n{CYAN}Press 1 or 2...{RESET}")
    
    while True:
        char = msvcrt.getch().decode('utf-8').lower()
        if char == '1':
            return "true"
        elif char == '2':
            return "no_repeats"
        elif char == 'q':
            sys.exit(0)

def show_result(num, limit, mode, pool_size=None):
    """Displays the generated number in a focused, clean UI."""
    clear_screen()
    print_header()
    
    mode_text = "True Random" if mode == "true" else "No Repeats"
    print(f"\n{YELLOW}   Limit: {BOLD}{limit}{RESET} | {YELLOW}Mode: {BOLD}{mode_text}{RESET}")
    
    if pool_size is not None:
        print(f"{MAGENTA}   Remaining in pool: {pool_size}{RESET}")
    
    print(f"\n{CYAN}   Generating...{RESET}")
    time.sleep(0.3) # delay
    
    print(f"\n{GREEN}{BOLD}   >>> RESULT: {num} <<<{RESET}")
    print(f"\n{CYAN}--------------------------------------------{RESET}")

def main():
    """Major application loop."""
    limit = None
    mode = None
    pool = []
    
    while True:
        if limit is None:
            clear_screen()
            print_header()
            limit = get_limit()
            mode = get_mode()
            
            # Prepare pool for No Repeats mode
            pool = list(range(1, limit + 1))
            random.shuffle(pool)
        
        # Determine number to display
        if mode == "true":
            num = random.randint(1, limit)
            show_result(num, limit, mode)
        else:
            if not pool:
                print(f"\n{MAGENTA}   Pool exhausted! Reshuffling...{RESET}")
                time.sleep(1)
                pool = list(range(1, limit + 1))
                random.shuffle(pool)
            
            num = pool.pop()
            show_result(num, limit, mode, len(pool))
        
        # Ask for next step with single keypress detection
        while True:
            print(f"\n{BOLD}Choices:{RESET}")
            print(f"  [{YELLOW}y{RESET}] Change settings (limit/mode)")
            print(f"  [{YELLOW}n{RESET}] Generate again (or press {YELLOW}ENTER{RESET})")
            print(f"  [{YELLOW}q{RESET}] Quit")
            
            # Instant keypress detection
            char_raw = msvcrt.getch()
            
            # Logic: Enter key (\r on Windows) defaults to 'n'
            if char_raw == b'\r':
                choice = 'n'
            else:
                try:
                    choice = char_raw.decode('utf-8').lower()
                except UnicodeDecodeError:
                    continue
            
            if choice == 'y':
                limit = None # reset to trigger input loop
                break
            elif choice == 'n':
                break
            elif choice == 'q':
                print(f"\n{MAGENTA}Goodbye!{RESET}")
                sys.exit(0)
            else:
                # Ignore invalid keys or stay in loop
                pass

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Interrupted by user. Exiting...{RESET}")
        sys.exit(0)
