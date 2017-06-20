import keras


class LossHistory(keras.callbacks.Callback):
    def on_train_begin(self, logs={}):
        self.accs = list()

    def on_batch_end(self, batch, logs={}):
        self.accs.append(logs.get('acc'))


class Base:
    def __init__(self, train_generator, epochs, steps_per_epoch=1000, valid_steps=500):
        self.train_generator = train_generator
        self.epochs = epochs
        self.steps_per_epoch = steps_per_epoch
        self.valid_steps = valid_steps
        self.model = None
        self.history = LossHistory()

    def train(self):
        pass
    
    def test(self, valid_generator):
        score = self.model.evaluate_generator(valid_generator, steps=self.valid_steps)
        print('Test loss:', score[0])
        print('Test accuracy:', score[1])
        return round(score[0], 4), round(score[1], 4)

