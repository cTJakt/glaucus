from __future__ import print_function

from keras import Input
from keras.engine import Model
from keras.models import Sequential
from keras.layers import Dense, Dropout, TimeDistributed, LSTM
from keras.optimizers import RMSprop
from src.dl.Base import Base


class HirRnn(Base):
    def __init__(self, train_generator, epochs, steps_per_epoch=1000, valid_steps=500):
        Base.__init__(self, train_generator, epochs, steps_per_epoch, valid_steps)

    def train(self):
        print("HiRnn Initial...")
        input_shape = self.train_generator.image_shape
        num_classes = self.train_generator.num_class
        # 4D input.
        x = Input(shape=input_shape)
        print(input_shape, self.epochs, self.steps_per_epoch, self.valid_steps)

        # Encodes a row of pixels using TimeDistributed Wrapper.
        encoded_rows = TimeDistributed(LSTM(128))(x)

        # Encodes columns of encoded rows.
        encoded_columns = LSTM(128)(encoded_rows)

        # Final predictions and model.
        prediction = Dense(num_classes, activation='softmax')(encoded_columns)
        self.model = Model(x, prediction)
        self.model.compile(loss='categorical_crossentropy',
                           optimizer='rmsprop',
                           metrics=['accuracy'])

        self.model.fit_generator(self.train_generator,
                                 epochs=self.epochs,
                                 steps_per_epoch=self.steps_per_epoch,
                                 verbose=1,
                                 callbacks=[self.history])
        print(self.history.accs)
        return self.history.accs, self.model

    def test(self, test_generator):
        return Base.test(test_generator)
