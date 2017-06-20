from __future__ import print_function
import keras
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K
from src.dl.Base import Base


class Cnn(Base):
    def __init__(self, train_generator, epochs, steps_per_epoch=1000, valid_steps=500):
        Base.__init__(self, train_generator, epochs, steps_per_epoch, valid_steps)

    def train(self):
        print("Cnn Initial...")
        input_shape = self.train_generator.image_shape
        num_classes = self.train_generator.num_class
        self.model = Sequential()
        self.model.add(Conv2D(32, kernel_size=(3, 3),
                              activation='relu',
                              input_shape=input_shape))
        self.model.add(Conv2D(64, (3, 3), activation='relu'))
        self.model.add(MaxPooling2D(pool_size=(2, 2)))
        self.model.add(Dropout(0.25))
        self.model.add(Flatten())
        self.model.add(Dense(128, activation='relu'))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(num_classes, activation='softmax'))

        self.model.compile(loss=keras.losses.categorical_crossentropy,
                           optimizer=keras.optimizers.Adadelta(),
                           metrics=['accuracy'])

        self.model.fit_generator(self.train_generator,
                                 epochs=self.epochs,
                                 steps_per_epoch=self.steps_per_epoch,
                                 verbose=1,
                                 callbacks=[self.history])

        print(self.history.accs)
        return self.history.accs, self.model

    def test(self, test_generator):
        return super().test(test_generator)
