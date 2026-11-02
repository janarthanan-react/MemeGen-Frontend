export interface MobileEmoji {
  emoji: string;
  name: string;
  category: MobileEmojiCategory;
  keywords: string;
}

export type MobileEmojiCategory =
  | 'All'
  | 'Memes & Viral'
  | 'Smileys & Faces'
  | 'Gestures'
  | 'Hearts'
  | 'Animals'
  | 'Food & Drink'
  | 'Objects & Chaos';

export const MOBILE_EMOJI_CATEGORIES: MobileEmojiCategory[] = [
  'All',
  'Memes & Viral',
  'Smileys & Faces',
  'Gestures',
  'Hearts',
  'Animals',
  'Food & Drink',
  'Objects & Chaos',
];

export const MOBILE_EMOJIS: MobileEmoji[] = [
  // ==========================================
  // CATEGORY 1: MEMES & VIRAL
  // ==========================================
  { emoji: '\u{1F480}', name: 'Skull', category: 'Memes & Viral', keywords: 'skull dead dying laughing i am dead rip' },
  { emoji: '\u{1F5FF}', name: 'Moai / Gigachad', category: 'Memes & Viral', keywords: 'moai stone chad gigachad statue easter island mewing sigma' },
  { emoji: '\u{1F921}', name: 'Clown', category: 'Memes & Viral', keywords: 'clown circus foolish silly fool joke honk' },
  { emoji: '\u{1F525}', name: 'Fire', category: 'Memes & Viral', keywords: 'fire flame lit hot blaze trending viral heat' },
  { emoji: '\u{1F4AF}', name: 'Hundred', category: 'Memes & Viral', keywords: '100 hundred real keep it real percent score facts' },
  { emoji: '\u{1F602}', name: 'Tears of Joy', category: 'Memes & Viral', keywords: 'joy laugh laughing tears haha lol rofl funny' },
  { emoji: '\u{1F923}', name: 'ROFL', category: 'Memes & Viral', keywords: 'rofl rolling floor laughing funny hysterics lol' },
  { emoji: '\u{1F62D}', name: 'Loudly Crying', category: 'Memes & Viral', keywords: 'crying sob tears drama sad hysterical weep' },
  { emoji: '\u{1F440}', name: 'Eyes', category: 'Memes & Viral', keywords: 'eyes look side eye watching suspicious see peeking' },
  { emoji: '\u{1F9E2}', name: 'Cap', category: 'Memes & Viral', keywords: 'cap no cap hat baseball blue cap lie lying truth' },
  { emoji: '\u{1F9E0}', name: 'Brain', category: 'Memes & Viral', keywords: 'brain galaxy brain big brain smart intellect think' },
  { emoji: '\u{1F37F}', name: 'Popcorn', category: 'Memes & Viral', keywords: 'popcorn drama movie entertainment watching' },
  { emoji: '\u{1F6A9}', name: 'Red Flag', category: 'Memes & Viral', keywords: 'red flag toxic warning danger alert avoid' },
  { emoji: '\u{1F680}', name: 'Rocket', category: 'Memes & Viral', keywords: 'rocket to the moon crypto blast launch hype space' },
  { emoji: '\u{1F4B8}', name: 'Money Flying', category: 'Memes & Viral', keywords: 'money wings cash fly spend broke rich dollar' },
  { emoji: '\u{1F451}', name: 'Crown', category: 'Memes & Viral', keywords: 'crown king queen royalty win boss winner' },
  { emoji: '\u{1F438}', name: 'Frog', category: 'Memes & Viral', keywords: 'frog pepe toad green ribbit meme' },
  { emoji: '\u{1F410}', name: 'Goat', category: 'Memes & Viral', keywords: 'goat greatest of all time messi ronaldo legend best' },
  { emoji: '\u{2615}', name: 'Coffee Cup', category: 'Memes & Viral', keywords: 'coffee tea sip sips tea morning java caffeine' },
  { emoji: '\u{1F485}', name: 'Nail Polish', category: 'Memes & Viral', keywords: 'nail polish slay fabulous nonchalant period queen' },
  { emoji: '\u{1F9CF}', name: 'Mewing', category: 'Memes & Viral', keywords: 'mewing jawline chad sigma look listen shh' },
  { emoji: '\u{1F92B}', name: 'Shushing Face', category: 'Memes & Viral', keywords: 'shh quiet secret silent silent silence hush' },
  { emoji: '\u{1FAE0}', name: 'Melting Face', category: 'Memes & Viral', keywords: 'melting melt overwhelm heat awkward sarcasm smile' },
  { emoji: '\u{1FAE1}', name: 'Saluting Face', category: 'Memes & Viral', keywords: 'salute yes sir respect army honor soldier' },
  { emoji: '\u{1F928}', name: 'Raised Eyebrow', category: 'Memes & Viral', keywords: 'eyebrow the rock suspicious skepticism doubt distrust' },
  { emoji: '\u{1F9D0}', name: 'Monocle', category: 'Memes & Viral', keywords: 'monocle investigate hmm analyze fancy check' },
  { emoji: '\u{1F913}', name: 'Nerd Face', category: 'Memes & Viral', keywords: 'nerd glasses actually smart geek dork' },
  { emoji: '\u{1F643}', name: 'Upside Down', category: 'Memes & Viral', keywords: 'upside down silly irony sarcasm goof awkward' },
  { emoji: '\u{1F9CD}', name: 'Standing NPC', category: 'Memes & Viral', keywords: 'standing person npc awkward posture wait bro' },
  { emoji: '\u{1F4A9}', name: 'Poo', category: 'Memes & Viral', keywords: 'poop poo crap dump stinky funny shit' },

  // ==========================================
  // CATEGORY 2: SMILEYS & FACES
  // ==========================================
  { emoji: '\u{1F600}', name: 'Grinning Face', category: 'Smileys & Faces', keywords: 'grinning smile happy pleased cheerful' },
  { emoji: '\u{1F603}', name: 'Grinning Big Eyes', category: 'Smileys & Faces', keywords: 'grin big eyes smile delight excited' },
  { emoji: '\u{1F604}', name: 'Grinning Smiling Eyes', category: 'Smileys & Faces', keywords: 'smile smiling eyes joy fun laughter' },
  { emoji: '\u{1F601}', name: 'Beaming Face', category: 'Smileys & Faces', keywords: 'beam teeth smile happy proud bright' },
  { emoji: '\u{1F606}', name: 'Squinting Face', category: 'Smileys & Faces', keywords: 'squint haha lol smile laugh giggle' },
  { emoji: '\u{1F605}', name: 'Sweat Smile', category: 'Smileys & Faces', keywords: 'sweat relief nervous close call whew' },
  { emoji: '\u{1F607}', name: 'Innocent Halo', category: 'Smileys & Faces', keywords: 'halo angel innocent good pure sweet' },
  { emoji: '\u{1F609}', name: 'Winking Face', category: 'Smileys & Faces', keywords: 'wink winking flirt playful joke sly' },
  { emoji: '\u{1F60A}', name: 'Warm Smile', category: 'Smileys & Faces', keywords: 'blush smile sweet warm kind content' },
  { emoji: '\u{1F60B}', name: 'Savoring Food', category: 'Smileys & Faces', keywords: 'yum delicious tongue tasty food savor' },
  { emoji: '\u{1F60E}', name: 'Cool Shades', category: 'Smileys & Faces', keywords: 'sunglasses cool boss confident smooth chill' },
  { emoji: '\u{1F60D}', name: 'Heart Eyes', category: 'Smileys & Faces', keywords: 'love crush adore heart romantic beauty' },
  { emoji: '\u{1F970}', name: 'Smiling Hearts', category: 'Smileys & Faces', keywords: 'hearts affection loved romantic cute' },
  { emoji: '\u{1F618}', name: 'Blowing Kiss', category: 'Smileys & Faces', keywords: 'kiss mwah love affection flirt' },
  { emoji: '\u{1F929}', name: 'Star-Struck', category: 'Smileys & Faces', keywords: 'star eyes wow amazed celebrity fan' },
  { emoji: '\u{1F973}', name: 'Partying Face', category: 'Smileys & Faces', keywords: 'party celebrate horn confetti birthday woo' },
  { emoji: '\u{1F60F}', name: 'Smirk', category: 'Smileys & Faces', keywords: 'smirk suggest sly knowing cheeky grin' },
  { emoji: '\u{1F612}', name: 'Unamused', category: 'Smileys & Faces', keywords: 'unamused bored annoyed straight face really' },
  { emoji: '\u{1F614}', name: 'Pensive Face', category: 'Smileys & Faces', keywords: 'pensive sad regret thoughtful moody' },
  { emoji: '\u{1F61F}', name: 'Worried Face', category: 'Smileys & Faces', keywords: 'worried concern anxiety distress fret' },
  { emoji: '\u{1F615}', name: 'Confused Face', category: 'Smileys & Faces', keywords: 'confused huh what unsure puzzled' },
  { emoji: '\u{1F97A}', name: 'Pleading Eyes', category: 'Smileys & Faces', keywords: 'pleading puppy eyes please beg cute forgive' },
  { emoji: '\u{1F622}', name: 'Crying Tear', category: 'Smileys & Faces', keywords: 'cry tear sad weep pain upset' },
  { emoji: '\u{1F624}', name: 'Triumph Steam', category: 'Smileys & Faces', keywords: 'steam nose huff proud angry stubborn' },
  { emoji: '\u{1F621}', name: 'Rage Pouting', category: 'Smileys & Faces', keywords: 'rage red angry mad furious furious' },
  { emoji: '\u{1F92C}', name: 'Cursing Face', category: 'Smileys & Faces', keywords: 'curse swear censor symbols angry rage' },
  { emoji: '\u{1F92F}', name: 'Exploding Head', category: 'Smileys & Faces', keywords: 'mind blown explosion shocked disbelief shock' },
  { emoji: '\u{1F633}', name: 'Flushed Face', category: 'Smileys & Faces', keywords: 'flushed embarrassment blush shocked wide eyes' },
  { emoji: '\u{1F975}', name: 'Hot Face', category: 'Smileys & Faces', keywords: 'hot sweat heat summer fever exhausted' },
  { emoji: '\u{1F976}', name: 'Cold Face', category: 'Smileys & Faces', keywords: 'cold freezing icicle winter freeze blue' },
  { emoji: '\u{1F631}', name: 'Screaming Scream', category: 'Smileys & Faces', keywords: 'scream terror horror panic omg home alone' },
  { emoji: '\u{1F914}', name: 'Thinking Face', category: 'Smileys & Faces', keywords: 'thinking ponder hmm wonder curious consider' },
  { emoji: '\u{1F92D}', name: 'Gasping Hand', category: 'Smileys & Faces', keywords: 'oops giggle hand mouth secretly laugh' },
  { emoji: '\u{1F971}', name: 'Yawning Face', category: 'Smileys & Faces', keywords: 'yawn tired sleepy bore boring sleep' },
  { emoji: '\u{1F634}', name: 'Sleeping Face', category: 'Smileys & Faces', keywords: 'sleeping zzz tired dream rest night' },
  { emoji: '\u{1F924}', name: 'Drooling Face', category: 'Smileys & Faces', keywords: 'drool desire craving food thirst sleep' },
  { emoji: '\u{1F635}', name: 'Crossed-Out Eyes', category: 'Smileys & Faces', keywords: 'knockout dizzy passed out dead stunned' },
  { emoji: '\u{1F910}', name: 'Zipper Mouth', category: 'Smileys & Faces', keywords: 'zipper secret quiet locked silence confidential' },
  { emoji: '\u{1F922}', name: 'Nauseated Face', category: 'Smileys & Faces', keywords: 'nauseated sick gross disgust barf' },
  { emoji: '\u{1F92E}', name: 'Vomiting Barf', category: 'Smileys & Faces', keywords: 'vomit puke barf spew gross sick' },
  { emoji: '\u{1F911}', name: 'Money Mouth', category: 'Smileys & Faces', keywords: 'money rich greedy dollar cash jackpot' },
  { emoji: '\u{1F920}', name: 'Cowboy Face', category: 'Smileys & Faces', keywords: 'cowboy hat western yeehaw howdy wild' },
  { emoji: '\u{1F608}', name: 'Devil Smile', category: 'Smileys & Faces', keywords: 'devil horns mischievous evil prank smirk' },
  { emoji: '\u{1F47B}', name: 'Ghost', category: 'Smileys & Faces', keywords: 'ghost boo spooky halloween spirit float' },
  { emoji: '\u{1F47D}', name: 'Alien', category: 'Smileys & Faces', keywords: 'alien ufo extraterrestrial martian space' },
  { emoji: '\u{1F916}', name: 'Robot', category: 'Smileys & Faces', keywords: 'robot bot ai android cyborg metal' },

  // ==========================================
  // CATEGORY 3: GESTURES & HANDS
  // ==========================================
  { emoji: '\u{1F44D}', name: 'Thumbs Up', category: 'Gestures', keywords: 'thumbs up like approve good yes ok agree' },
  { emoji: '\u{1F44E}', name: 'Thumbs Down', category: 'Gestures', keywords: 'thumbs down dislike bad no disagree reject' },
  { emoji: '\u{1F44F}', name: 'Clapping Hands', category: 'Gestures', keywords: 'clap applause praise bravo well done cheer' },
  { emoji: '\u{1F64C}', name: 'Raising Hands', category: 'Gestures', keywords: 'praise celebrate hooray hallelujah cheer' },
  { emoji: '\u{1F90C}', name: 'Pinched Fingers', category: 'Gestures', keywords: 'pinched italian hand gesture what do you mean mama mia' },
  { emoji: '\u{1F90F}', name: 'Pinching Hand', category: 'Gestures', keywords: 'pinching tiny little bit small tiny amount' },
  { emoji: '\u{270C}\u{FE0F}', name: 'Peace Sign', category: 'Gestures', keywords: 'peace victory two v pose' },
  { emoji: '\u{1F91E}', name: 'Crossed Fingers', category: 'Gestures', keywords: 'luck hope fingers crossed promise wish' },
  { emoji: '\u{1F918}', name: 'Rock On', category: 'Gestures', keywords: 'rock horns metal music heavy party' },
  { emoji: '\u{1F919}', name: 'Call Me Hand', category: 'Gestures', keywords: 'call shaka hang loose surf phone' },
  { emoji: '\u{1F448}', name: 'Point Left', category: 'Gestures', keywords: 'point left direction that way' },
  { emoji: '\u{1F449}', name: 'Point Right', category: 'Gestures', keywords: 'point right direction look there' },
  { emoji: '\u{1F446}', name: 'Point Up', category: 'Gestures', keywords: 'point up this look above' },
  { emoji: '\u{1F447}', name: 'Point Down', category: 'Gestures', keywords: 'point down below under read this' },
  { emoji: '\u{1F44B}', name: 'Waving Hand', category: 'Gestures', keywords: 'wave hello goodbye hi bye farewell' },
  { emoji: '\u{1F91D}', name: 'Handshake', category: 'Gestures', keywords: 'handshake deal agreement partner business meet' },
  { emoji: '\u{1F64F}', name: 'Folded Hands', category: 'Gestures', keywords: 'pray please thank you thanks namaste hope' },
  { emoji: '\u{1F4AA}', name: 'Flexed Biceps', category: 'Gestures', keywords: 'muscle flex strong gym power workout gains' },
  { emoji: '\u{1F926}', name: 'Facepalm', category: 'Gestures', keywords: 'facepalm exasperation smh disbelief idiot dumb' },
  { emoji: '\u{1F937}', name: 'Shrug', category: 'Gestures', keywords: 'shrug idfk dunno whatever guess who knows' },
  { emoji: '\u{1F3C3}', name: 'Running', category: 'Gestures', keywords: 'running run sprint fleeing escape cardio' },
  { emoji: '\u{1F483}', name: 'Dancing Woman', category: 'Gestures', keywords: 'dancer tango party flamenco celebrate' },
  { emoji: '\u{1F57A}', name: 'Dancing Man', category: 'Gestures', keywords: 'dance disco party groove music' },

  // ==========================================
  // CATEGORY 4: HEARTS & EMOTION
  // ==========================================
  { emoji: '\u{2764}\u{FE0F}', name: 'Red Heart', category: 'Hearts', keywords: 'heart love red romantic amour passion' },
  { emoji: '\u{1F494}', name: 'Broken Heart', category: 'Hearts', keywords: 'broken heart heartbreak sad grief dump break up' },
  { emoji: '\u{1F496}', name: 'Sparkling Heart', category: 'Hearts', keywords: 'sparkle heart glitter shine love cute' },
  { emoji: '\u{1F495}', name: 'Two Hearts', category: 'Hearts', keywords: 'two hearts love romantic pair sweet' },
  { emoji: '\u{1F5A4}', name: 'Black Heart', category: 'Hearts', keywords: 'black heart dark gothic emo sorrow' },
  { emoji: '\u{1F90D}', name: 'White Heart', category: 'Hearts', keywords: 'white heart pure angel peace clean' },
  { emoji: '\u{1F49C}', name: 'Purple Heart', category: 'Hearts', keywords: 'purple heart bts army glam royal' },
  { emoji: '\u{1F499}', name: 'Blue Heart', category: 'Hearts', keywords: 'blue heart calm trust loyalty boy' },
  { emoji: '\u{1F49A}', name: 'Green Heart', category: 'Hearts', keywords: 'green heart nature eco envy envy' },
  { emoji: '\u{1F49B}', name: 'Yellow Heart', category: 'Hearts', keywords: 'yellow heart friendship joy sunny' },
  { emoji: '\u{1F48B}', name: 'Kiss Mark', category: 'Hearts', keywords: 'kiss lips lipstick makeup romance flirt' },
  { emoji: '\u{1F4A2}', name: 'Anger Symbol', category: 'Hearts', keywords: 'anger mad vein pop manga anime annoyed' },
  { emoji: '\u{1F4A5}', name: 'Boom Blast', category: 'Hearts', keywords: 'boom collision explosion bang pow crash' },
  { emoji: '\u{1F4A6}', name: 'Sweat Drops', category: 'Hearts', keywords: 'sweat water droplets splash drip moist' },
  { emoji: '\u{1F4A8}', name: 'Dashing Away', category: 'Hearts', keywords: 'dash zoom fast run away dust smoke' },

  // ==========================================
  // CATEGORY 5: ANIMALS & PETS
  // ==========================================
  { emoji: '\u{1F436}', name: 'Dog Face', category: 'Animals', keywords: 'dog puppy pet canine doggo bork woof' },
  { emoji: '\u{1F431}', name: 'Cat Face', category: 'Animals', keywords: 'cat kitty feline pet meow purr' },
  { emoji: '\u{1F435}', name: 'Monkey Face', category: 'Animals', keywords: 'monkey ape chimp primate silly jungle' },
  { emoji: '\u{1F648}', name: 'See-No-Evil', category: 'Animals', keywords: 'monkey shy blind see no evil hide' },
  { emoji: '\u{1F649}', name: 'Hear-No-Evil', category: 'Animals', keywords: 'monkey hear no evil ignore listen quiet' },
  { emoji: '\u{1F64A}', name: 'Speak-No-Evil', category: 'Animals', keywords: 'monkey speak no evil secret quiet oops' },
  { emoji: '\u{1F98A}', name: 'Fox', category: 'Animals', keywords: 'fox clever sly orange animal' },
  { emoji: '\u{1F43B}', name: 'Bear', category: 'Animals', keywords: 'bear grizzly honey forest fluffy' },
  { emoji: '\u{1F43C}', name: 'Panda', category: 'Animals', keywords: 'panda bear bamboo cute china' },
  { emoji: '\u{1F981}', name: 'Lion', category: 'Animals', keywords: 'lion king roar brave predator' },
  { emoji: '\u{1F437}', name: 'Pig', category: 'Animals', keywords: 'pig piggy pork oink pink' },
  { emoji: '\u{1F430}', name: 'Rabbit', category: 'Animals', keywords: 'rabbit bunny hare easter cute' },
  { emoji: '\u{1F986}', name: 'Duck', category: 'Animals', keywords: 'duck quack bird lake yellow' },
  { emoji: '\u{1F989}', name: 'Owl', category: 'Animals', keywords: 'owl wise night bird hoot' },
  { emoji: '\u{1F987}', name: 'Bat', category: 'Animals', keywords: 'bat vampire spooky batman night' },
  { emoji: '\u{1F43A}', name: 'Wolf', category: 'Animals', keywords: 'wolf pack alpha howl lone' },
  { emoji: '\u{1F984}', name: 'Unicorn', category: 'Animals', keywords: 'unicorn magic horn fantasy rainbow' },
  { emoji: '\u{1F988}', name: 'Shark', category: 'Animals', keywords: 'shark ocean predator bite jaws' },
  { emoji: '\u{1F419}', name: 'Octopus', category: 'Animals', keywords: 'octopus tentacles sea creature kraken' },
  { emoji: '\u{1F41D}', name: 'Bee', category: 'Animals', keywords: 'bee honey buzz insect sting' },

  // ==========================================
  // CATEGORY 6: FOOD & DRINKS
  // ==========================================
  { emoji: '\u{1F355}', name: 'Pizza', category: 'Food & Drink', keywords: 'pizza slice cheese pepperoni crust fast food' },
  { emoji: '\u{1F354}', name: 'Burger', category: 'Food & Drink', keywords: 'burger hamburger cheeseburger fast food beef' },
  { emoji: '\u{1F35F}', name: 'French Fries', category: 'Food & Drink', keywords: 'fries french fries potato fast food snack' },
  { emoji: '\u{1F32E}', name: 'Taco', category: 'Food & Drink', keywords: 'taco mexican tuesday food crunch' },
  { emoji: '\u{1F363}', name: 'Sushi', category: 'Food & Drink', keywords: 'sushi japanese fish roll salmon' },
  { emoji: '\u{1F369}', name: 'Donut', category: 'Food & Drink', keywords: 'donut doughnut glazed sweet dessert bakery' },
  { emoji: '\u{1F36A}', name: 'Cookie', category: 'Food & Drink', keywords: 'cookie chocolate chip biscuit sweet snack' },
  { emoji: '\u{1F382}', name: 'Birthday Cake', category: 'Food & Drink', keywords: 'cake birthday celebration sweet candles' },
  { emoji: '\u{1F951}', name: 'Avocado', category: 'Food & Drink', keywords: 'avocado toast guacamole green healthy' },
  { emoji: '\u{1F34C}', name: 'Banana', category: 'Food & Drink', keywords: 'banana fruit yellow potassium peel' },
  { emoji: '\u{1F349}', name: 'Watermelon', category: 'Food & Drink', keywords: 'watermelon melon fruit summer juicy' },
  { emoji: '\u{1F37A}', name: 'Beer Mug', category: 'Food & Drink', keywords: 'beer mug alcohol pub cheers brew drink' },
  { emoji: '\u{1F37B}', name: 'Clinking Beers', category: 'Food & Drink', keywords: 'cheers beers celebrate toast party drinks' },
  { emoji: '\u{1F377}', name: 'Wine Glass', category: 'Food & Drink', keywords: 'wine glass red wine drink alcohol cheers' },
  { emoji: '\u{1F9CB}', name: 'Boba Tea', category: 'Food & Drink', keywords: 'boba bubble tea tapioca drink sweet' },
  { emoji: '\u{1F964}', name: 'Soda Drink', category: 'Food & Drink', keywords: 'soda cup straw pop drink refreshment' },

  // ==========================================
  // CATEGORY 7: OBJECTS & CHAOS
  // ==========================================
  { emoji: '\u{1F4A3}', name: 'Bomb', category: 'Objects & Chaos', keywords: 'bomb explosive blast dynamite destroy boom' },
  { emoji: '\u{1F9E8}', name: 'Firecracker', category: 'Objects & Chaos', keywords: 'firecracker tnt dynamite explosion blast' },
  { emoji: '\u{2694}\u{FE0F}', name: 'Crossed Swords', category: 'Objects & Chaos', keywords: 'swords battle fight pvp combat war' },
  { emoji: '\u{1F6E1}\u{FE0F}', name: 'Shield', category: 'Objects & Chaos', keywords: 'shield protect defense armor secure' },
  { emoji: '\u{1F52A}', name: 'Knife', category: 'Objects & Chaos', keywords: 'knife blade stab kitchen weapon danger' },
  { emoji: '\u{1F6A8}', name: 'Police Siren', category: 'Objects & Chaos', keywords: 'siren police emergency red alert cop 911' },
  { emoji: '\u{1F6D1}', name: 'Stop Sign', category: 'Objects & Chaos', keywords: 'stop octagonal red sign halt pause' },
  { emoji: '\u{26A0}\u{FE0F}', name: 'Warning', category: 'Objects & Chaos', keywords: 'warning caution alert danger hazard' },
  { emoji: '\u{1F3AE}', name: 'Video Game', category: 'Objects & Chaos', keywords: 'game controller gamer playstation xbox nintendo' },
  { emoji: '\u{1F3C6}', name: 'Trophy', category: 'Objects & Chaos', keywords: 'trophy winner champion 1st gold prize' },
  { emoji: '\u{1F4F1}', name: 'Mobile Phone', category: 'Objects & Chaos', keywords: 'phone smartphone mobile iphone android call' },
  { emoji: '\u{1F4BB}', name: 'Laptop', category: 'Objects & Chaos', keywords: 'laptop computer macbook coder code work' },
  { emoji: '\u{1F4B0}', name: 'Money Bag', category: 'Objects & Chaos', keywords: 'money bag cash rich fortune loot dollar' },
  { emoji: '\u{1F48E}', name: 'Gem Diamond', category: 'Objects & Chaos', keywords: 'diamond gem jewel diamond hands crypto rich' },
  { emoji: '\u{1F697}', name: 'Car', category: 'Objects & Chaos', keywords: 'car automobile vehicle drive traffic' },
  { emoji: '\u{1F9FB}', name: 'Toilet Paper', category: 'Objects & Chaos', keywords: 'toilet paper roll wipe bathroom covid' },
  { emoji: '\u{1FAA6}', name: 'Tombstone', category: 'Objects & Chaos', keywords: 'tombstone grave rip cemetery spooky death' },
  { emoji: '\u{26A1}', name: 'Lightning Zap', category: 'Objects & Chaos', keywords: 'lightning bolt zap electric power thunder flash' },
  { emoji: '\u{1F308}', name: 'Rainbow', category: 'Objects & Chaos', keywords: 'rainbow colors sky nature pride' },
  { emoji: '\u{1F319}', name: 'Crescent Moon', category: 'Objects & Chaos', keywords: 'moon night dark crescent sleepy sky' },
  { emoji: '\u{1FA90}', name: 'Planet', category: 'Objects & Chaos', keywords: 'planet saturn ring space galaxy cosmos' },
];
