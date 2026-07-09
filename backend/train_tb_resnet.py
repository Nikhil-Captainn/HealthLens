import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import os

# ================= PATHS =================
DATASET_PATH = "dataset/train"
IMG_SIZE = 160
BATCH_SIZE = 16
EPOCHS = 8

# ================= DATA =================
train_gen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    zoom_range=0.1,
    horizontal_flip=True
)

train_data = train_gen.flow_from_directory(
    DATASET_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="binary"
)

print("Class mapping:", train_data.class_indices)

# ================= CLASS WEIGHTS =================
# NORMAL=0 , TB=1  (based on folder names)
class_weight = {
    0: 1.0,     # NORMAL
    1: 5.0      # TB boosted due to imbalance
}

print("Using class weights:", class_weight)

# ================= MODEL =================
base_model = ResNet50(
    weights="imagenet",
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

base_model.trainable = False  # freeze backbone

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation="relu")(x)
x = Dropout(0.4)(x)
output = Dense(1, activation="sigmoid")(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ================= TRAIN =================
history = model.fit(
    train_data,
    epochs=EPOCHS,
    class_weight=class_weight
)

# ================= SAVE =================
model.save("tb_model.h5")
print("✅ Model saved as tb_model.h5")
