import React from 'react'

import GenericOperationResolver from "./GenericOperationResolver";
import SemanticData from "./SemanticData";

import GenericOperationDialog from '../components-new/GenericOperationDialog'
import { States } from "../handlers/ActionHandler";
import ActionHandlerBuilder from '../handlers/ActionHandlerBuilder';

function GenericOperationHandler(api, setToRender) {
  return {
    executeOperation: _executeOperation(api, setToRender),
    sideEffect: _sideEffect(api, setToRender),
    show: _show(api, setToRender),
    findData: _findData(api, setToRender)
  }
}

const _sideEffect = (_, setToRender) => (fct, strategy, component, options) => (previousComponentData) =>
  genericOperationHandler(
    strategy || Strategies.IN_BACKGROUND,
    options,
    setToRender,
    (actionHandler) => {
      // TODO is it really necessary to have a component?
      callAsync(() => fct(previousComponentData))
        .then(() => actionHandler.setState(States.SUCCESS, previousComponentData))
        .catch(error => actionHandler.setState(States.ERROR, error))
        .finally(() => {
          if (component === undefined) { actionHandler.setState(States.CLOSE) }
        })

      return component instanceof Function ? component : () => component
    }
  )

const _executeOperation = (api, setToRender) => (operation, strategy, component, options) => (previousComponentData) =>
  genericOperationHandler(
    strategy,
    options, 
    setToRender,
    (actionHandler) => {
      const operationResolver = typeof operation === 'string'
        ? GenericOperationResolver.fromKey(operation, api)
        : GenericOperationResolver.fromOperation(operation, api)

      const [ form, formDefaultValues ] = operationResolver.getFormWithDefaultValues()
      const [ filters, filtersDefaultValues ] = operationResolver.getFiltersWithDefaultValues()
      const operationCaller = operationResolver.getCaller()

      const actualComponent = component || defaultExecuteOperationComponent(strategy)
      return () =>
        actualComponent({
          previousComponentData,
          operationCaller,
          form,
          formDefaultValues,
          filters,
          filtersDefaultValues,
          onComplete: (data) => actionHandler.complete(data)
        })
    }
  )

function defaultExecuteOperationComponent(strategy) {
  switch(strategy) {
    case Strategies.IN_BACKGROUND:
      return GenericOperationDialog
    default:
      return null
  }
}

const _show = (_, setToRender) => (strategy, component, options) => (previousComponentData) =>
  genericOperationHandler(strategy, options, setToRender, (actionHandler) => {
    if (previousComponentData instanceof SemanticData) {
      // TODO
    }

    return React.isValidElement(component)
      ? () => component
      : () => component({previousComponentData, onComplete: actionHandler.complete})
  })

const _findData = (api, setToRender) =>
  (operation, strategy, options, component) => (previousComponentData) =>
    genericOperationHandler(strategy, options, setToRender, (actionHandler) => {
      // TODO
      return null
    })

// @type: componentBuilder: (action Handler) => component
const genericOperationHandler = (strategy, options, setToRender, componentBuilder) =>
  new Promise((resolve, reject) => {
    const actionHandler = ActionHandlerBuilder.build(strategy, options, setToRender, componentBuilder, resolve, reject)
    try {
      actionHandler.start()
    } catch (error) {
      actionHandler.close()
      reject(error)
    }
  })

function callAsync(fct) {
  return new Promise((resolve, reject) => {
    try {
      fct()
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export const Strategies = {
  IN_BACKGROUND: 'background',
  IN_BACKGROUND_WITH_NOTIFICATIONS: 'backgroundWithNotifs',
  IN_MODAL: 'modal',
  IN_MODAL_WITH_BUTTON: 'modalWithButton',
  IN_PORTAL: 'portal',
  IN_COMPONENT: 'component'
}

export default GenericOperationHandler
