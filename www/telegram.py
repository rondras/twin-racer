from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext
from telegram.error import BadRequest, Unauthorized

# Use your bot token here
BOT_TOKEN = '7286281298:AAEw8fYA4unaoPKTVpmiDkPPwsMWzH62f8U'
CHAT_ID = '-1002187844436'  # Your actual chat (group) ID, same as the channel ID

# Function to check if a user is a member of the chat (group) and the channel
def check_membership(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id

    try:
        # Check if the user is in the chat (group)
        chat_member = context.bot.get_chat_member(CHAT_ID, user_id)
    except (BadRequest, Unauthorized) as e:
        update.message.reply_text('Unable to verify membership in the chat. Please try again later.')
        print(f"Error checking chat membership: {e}")
        return

    try:
        # Check if the user is in the channel
        channel_member = context.bot.get_chat_member(CHAT_ID, user_id)  # Using the same ID for channel
    except (BadRequest, Unauthorized) as e:
        update.message.reply_text('Unable to verify membership in the channel. Please try again later.')
        print(f"Error checking channel membership: {e}")
        return

    # Determine membership status and respond accordingly
    if chat_member.status in ['member', 'administrator', 'creator'] and \
       channel_member.status in ['member', 'administrator', 'creator']:
        update.message.reply_text('You are a member of both the chat and the channel. You can be rewarded!')
        # Logic to reward the user here
    elif chat_member.status not in ['member', 'administrator', 'creator']:
        update.message.reply_text('You are not a member of the chat. Please join the chat to receive rewards.')
    elif channel_member.status not in ['member', 'administrator', 'creator']:
        update.message.reply_text('You are not a member of the channel. Please join the channel to receive rewards.')

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Welcome! Use /check to verify your membership in the chat and channel.')

# Function to check if the user has boosted the channel
def check_boost(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id

    try:
        # Check if the user is a member of the channel
        channel_member = context.bot.get_chat_member(CHAT_ID, user_id)
        
        if channel_member.status in ['member', 'administrator', 'creator']:
            update.message.reply_text('Thank you for boosting! You will now receive your reward.')
            # Logic to reward the user here
        else:
            update.message.reply_text('It seems you haven’t boosted the channel yet. Please try again.')

    except (BadRequest, Unauthorized) as e:
        update.message.reply_text('Unable to verify your boost status. Please try again later.')
        print(f"Error checking boost status: {e}")

def main():
    # Set up the updater and dispatcher
    updater = Updater(BOT_TOKEN, use_context=True)
    dp = updater.dispatcher

    # Register the command handlers
    dp.add_handler(CommandHandler('start', start))
    dp.add_handler(CommandHandler('check', check_membership))
    dp.add_handler(CommandHandler('checkboost', check_boost))  # Add this new handler

    # Start the bot
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
