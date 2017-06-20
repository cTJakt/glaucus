from __future__ import print_function

from keras.models import Sequential
from keras.layers import Dense, Conv2D, MaxPooling2D, Dropout, Flatten
from keras.optimizers import SGD

from src.dl.Base import Base


class Vgg(Base):
    def __init__(self, train_generator, epochs, steps_per_epoch=1000, valid_steps=500):
        Base.__init__(self, train_generator, epochs, steps_per_epoch, valid_steps)

    def train(self):
        print("Cnn with Vgg Initial...")
        input_shape = self.train_generator.image_shape
        self.model = Sequential()
        # input: 100x100 images with 3 channels -> (100, 100, 3) tensors.
        # this applies 32 convolution filters of size 3x3 each.
        self.model.add(Conv2D(32, (3, 3), activation='relu', input_shape=input_shape))
        self.model.add(Conv2D(32, (3, 3), activation='relu'))
        self.model.add(MaxPooling2D(pool_size=(2, 2)))
        self.model.add(Dropout(0.25))

        self.model.add(Conv2D(64, (3, 3), activation='relu'))
        self.model.add(Conv2D(64, (3, 3), activation='relu'))
        self.model.add(MaxPooling2D(pool_size=(2, 2)))
        self.model.add(Dropout(0.25))

        self.model.add(Flatten())
        self.model.add(Dense(256, activation='relu'))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(10, activation='softmax'))

        sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
        self.model.compile(loss='categorical_crossentropy', optimizer=sgd)

        self.model.fit_generator(self.train_generator,
                                 epochs=self.epochs,
                                 steps_per_epoch=self.steps_per_epoch,
                                 verbose=1,
                                 callbacks=[self.history])

        print(self.history.accs)
        return self.history.accs, self.model

    def test(self, test_generator):
        return Base.test(test_generator)
